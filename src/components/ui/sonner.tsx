    // sonner.tsx
    import { Toaster as Sonner, toast as sonnerToast } from "sonner";
    import { useTheme } from "next-themes";

    export const Toaster = () => {
        const { theme = "system" } = useTheme();

        return (
            <Sonner
                theme={theme as "light" | "dark" | "system"}
                position="top-center"
                expand
                richColors
                toastOptions={{
                    classNames: {
                        toast: "group toast border shadow-lg",
                        title: "font-medium",
                        description: "text-sm opacity-80",
                        actionButton: "bg-primary text-primary-foreground",
                        cancelButton: "bg-muted text-muted-foreground",
                    },
                    style: {
                        border: "1px solid var(--border)",
                        background: "var(--popover)",
                        color: "var(--popover-foreground)",
                    },
                }}
            />
        );
    };

    // Export du toast pour une utilisation simplifiée
    // eslint-disable-next-line react-refresh/only-export-components
    export { sonnerToast as toast };
