export type RotiLang = 'en' | 'fr';

/** The app is English by default; French is only offered on the ROTI page. */
export const DEFAULT_ROTI_LANG: RotiLang = 'en';

export interface RotiTexts {
  form: {
    ratingGroup: string;
    lowLabel: string;
    highLabel: string;
    commentLabel: string;
    commentPlaceholder: string;
    submit: string;
    errors: { noScore: string; saveFailed: string };
    successToast: string;
  };
  prompt: {
    title: string;
    intro: string;
    link: string;
  };
  page: {
    title: string;
    subtitle: string;
    goalTitle: string;
    goal: string;
    howTitle: string;
    steps: string[];
    furtherTitle: string;
    further: string;
    voteTitle: string;
    voteSubmit: string;
    languageSwitch: string;
  };
}

export const ROTI_TEXTS: Record<RotiLang, RotiTexts> = {
  en: {
    form: {
      ratingGroup: 'ROTI rating',
      lowLabel: "I learned nothing, I wasted my time",
      highLabel: 'I learned a lot!',
      commentLabel: 'Comment (optional)',
      commentPlaceholder: 'What could have been better?',
      submit: 'Submit',
      errors: {
        noScore: 'Please select a rating.',
        saveFailed: 'Unable to save your ROTI.',
      },
      successToast: 'Your ROTI rating has been recorded, thank you!',
    },
    prompt: {
      title: 'ROTI!',
      intro:
        "Let's take a moment for a quick retrospective... the ROTI! Don't know it?",
      link: "I'll explain here ;)",
    },
    page: {
      title: 'the ROTI!',
      subtitle: 'Return On Time Invested',
      goalTitle: 'The goal',
      goal: "Measure whether the meeting or workshop was worthwhile for the participants. It is also a way to help people realize how much they have grown and to celebrate small wins.",
      howTitle: 'How to proceed',
      steps: [
        'Gather the participants.',
        'Explain the rules: everyone rates from 1 to 5 using the fingers of one hand, and all ratings are revealed at the same time. 1 = I wasted my time, 5 = I learned a lot.',
        'Count down: "5, 4, 3, 2, 1... ROTI!".',
        'Record the ratings before the hands go down.',
        'Invite participants to justify their rating (improvement ideas or celebration).',
      ],
      furtherTitle: 'Going further',
      further: 'Come back to the low ratings and look for ways to improve together.',
      voteTitle: 'So? Did you learn something?',
      voteSubmit: 'Submit the ROTI',
      languageSwitch: 'Language',
    },
  },
  fr: {
    form: {
      ratingGroup: 'Note du ROTI',
      lowLabel: "Je n'ai rien appris, j'ai perdu mon temps",
      highLabel: "J'ai appris plein de choses !",
      commentLabel: 'Commentaire (facultatif)',
      commentPlaceholder: "Qu'est-ce qui aurait pu être mieux ?",
      submit: 'Valider',
      errors: {
        noScore: 'Veuillez sélectionner une note.',
        saveFailed: "Impossible d'enregistrer le ROTI.",
      },
      successToast: 'La note de votre ROTI est bien prise en compte, merci !',
    },
    prompt: {
      title: 'ROTI !',
      intro:
        "Prenons justement le temps de faire une petite rétrospective... le ROTI ! Tu ne connais pas ?",
      link: "Je t'explique ici ;)",
    },
    page: {
      title: 'le ROTI !',
      subtitle: 'Retour On Time Invest',
      goalTitle: "L'objectif",
      goal: "Mesurer si la réunion ou l'atelier a eu un intérêt pour les participants. C'est aussi un moyen de faire réaliser aux gens qu'ils ont évolué et de célébrer les petits succès.",
      howTitle: 'Comment procéder',
      steps: [
        'Réunir les participants.',
        "Expliquer les règles : chacun note sur 5 à l'aide des 5 doigts de la main, et les notes sont révélées simultanément. 1 = j'ai perdu mon temps, 5 = j'ai appris des choses.",
        'Lancer le décompte : « 5, 4, 3, 2, 1... ROTI ! ».',
        'Relever les notes avant que les mains se baissent.',
        "Inviter les participants à justifier leur note (axes d'amélioration ou célébration).",
      ],
      furtherTitle: 'Pour aller plus loin',
      further: "Revenir vers les notes basses pour chercher à s'améliorer ensemble.",
      voteTitle: 'Alors ? Est-ce que vous avez appris des choses ?',
      voteSubmit: 'Valider le ROTI',
      languageSwitch: 'Langue',
    },
  },
};
