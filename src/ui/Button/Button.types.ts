export enum Button_Type {
	ERROR = "error",
	SUCCESS = "success",
	PRIMARY = "primary",
	SECONDARY = "secondary",
	LABEL = "label",
	LINK = "link",
	WHITE = "white",
	LINK_EXTERNAL = "link-external",
	BASE = "base",
	REVERSE_ERROR = "reverse_error",
}

export enum Button_Style {
	SOLID = "solid",
	OUTLINED = "outlined",
	LINK = "link",

}

export type ButtonProps = {
	label?: string;
	type?: Button_Type;
	buttonType?: "button" | "submit";
	size?: string;
	style?: Button_Style;
	disabled?: boolean;
	url?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
	className?: string;
	icon?: React.ReactNode;
	isIconButton?: boolean;
	isLoader?: boolean;
	iconHeight?: string;
} & Record<string, any>;
