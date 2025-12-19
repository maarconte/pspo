export interface SidebarProps {
	className?: string;
}

export interface NavItem {
	title: string;
	href: string;
	icon: React.ReactNode;
	requiresAuth?: boolean;
	requiresRole?: 'admin' | 'dev';
}
