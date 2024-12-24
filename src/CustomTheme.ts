import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Theme {
        customTable: {
            fontSize: {
                lg: string;
                sm: string;
                md: string;
            };
        };
    }
    interface ThemeOptions {
        customTable?: {
            fontSize?: {
                lg?: string;
                sm?: string;
                md?: string;
            };
        };
    }
}

export const CustomTheme = createTheme({
    typography: {
        fontSize: 11, // Don't delete this
    },
    customTable: {
        fontSize: {
            lg: '16px',
            sm: '12px',
            md: '14px',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '8px',

                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                },
                body: {
                    whiteSpace: 'nowrap',
                    // padding: '6px 20px',
                    // borderBottom: 'none'
                }
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',

            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    fontSize: '10px',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    boxShadow: 'none !important',
                },
            },
        },
    },
});
