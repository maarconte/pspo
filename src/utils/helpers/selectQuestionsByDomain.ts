import type { Question } from "../types";

/** Fisher-Yates shuffle returning a new array. */
const shuffle = <T>(items: T[]): T[] => {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
};

/** Bucket holding questions without a domain, or whose domain has no configured share. */
const UNASSIGNED = null;
type Bucket = string | null;

/**
 * Splits `count` into per-bucket quotas with the largest-remainder method so the
 * quotas always sum to exactly `count`.
 */
const computeQuotas = (count: number, shares: Map<Bucket, number>): Map<Bucket, number> => {
	const exact = Array.from(shares, ([bucket, percent]) => ({
		bucket,
		quota: Math.floor((count * percent) / 100),
		remainder: ((count * percent) / 100) % 1,
	}));
	let missing = count - exact.reduce((sum, e) => sum + e.quota, 0);
	[...exact]
		.sort((a, b) => b.remainder - a.remainder)
		.forEach((entry) => {
			if (missing > 0) {
				entry.quota += 1;
				missing -= 1;
			}
		});
	return new Map<Bucket, number>(exact.map((e): [Bucket, number] => [e.bucket, e.quota]));
};

/**
 * Picks `count` random questions from `pool`, honouring the module's per-domain percentages.
 * The share not allocated to any domain (100 - sum) goes to questions without a domain
 * (or with a domain that isn't configured). If a bucket doesn't have enough questions,
 * the shortfall is filled from the remaining questions so the quiz keeps its length.
 * Without any configured percentage this is a plain random pick.
 */
export const selectQuestionsByDomain = (
	pool: Question[],
	count: number,
	domainPercents?: Record<string, number>,
): Question[] => {
	const configured = Object.entries(domainPercents ?? {}).filter(([, percent]) => percent > 0);
	const configuredTotal = configured.reduce((sum, [, percent]) => sum + percent, 0);
	if (configured.length === 0 || configuredTotal > 100) {
		return shuffle(pool).slice(0, count);
	}

	const shares = new Map<Bucket, number>(configured);
	if (configuredTotal < 100) shares.set(UNASSIGNED, 100 - configuredTotal);
	const quotas = computeQuotas(count, shares);

	const buckets = new Map<Bucket, Question[]>();
	shuffle(pool).forEach((question) => {
		const domain = question.domain?.trim();
		const bucket: Bucket = domain && shares.has(domain) ? domain : UNASSIGNED;
		buckets.set(bucket, [...(buckets.get(bucket) ?? []), question]);
	});

	const selected: Question[] = [];
	const leftovers: Question[] = [];
	buckets.forEach((questions, bucket) => {
		const quota = quotas.get(bucket) ?? 0;
		selected.push(...questions.slice(0, quota));
		leftovers.push(...questions.slice(quota));
	});

	const missing = count - selected.length;
	if (missing > 0) selected.push(...shuffle(leftovers).slice(0, missing));

	return shuffle(selected);
};
