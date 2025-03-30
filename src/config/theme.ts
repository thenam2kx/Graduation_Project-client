import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    app: {
      appHeader: string
      appFooter: string
      appAside: string
    };
  }
  interface ThemeOptions {
    app?: {
      appHeader?: string
      appFooter?: string
      appAside?: string
    };
  }
}

const APP_HEADER = '56px'
const APP_FOOTER = '40px'
const APP_ASIDE = '240px'

// A custom theme for this app
const theme = createTheme({
  app: {
    appHeader: APP_HEADER,
    appFooter: APP_FOOTER,
    appAside: APP_ASIDE
  },

  // colorSchemes: {
  //   light: {
  //     palette: {}
  //   },
  //   dark: {
  //     palette: {}
  //   }
  // },

  shape: {
    borderRadius: 4
  },

  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none',
    //       borderWidth: '0.5px',
    //       '&:hover': { borderWidth: '1px' }
    //     }
    //   }
    // },

    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth'
        },
        body: {
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#092454',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#002467',
            cursor: 'pointer'
          },
          '*': {
            scrollbarWidth: 'thin',
            borderRadius: '8px',
            scrollbarColor: '#8750f7 #2a1454'
          },
          scrollbarWidth: 'thin',
          scrollbarColor: '#8750f7 #2a1454'
        }
      }
    }
  }
})

export default theme
