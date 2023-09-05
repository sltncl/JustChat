import { theme } from '../theme'

export const generalStyles = {
   loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100vh',
      flex: '1',
   },
   errorContainer: {
      height: '10vh',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      px: 2,
   },
   homeContainer: {
      display: 'flex',
      flexDirection: 'row',
      maxHeight: '100vh',
      maxWidth: '100vw'
   }
}

export const sidebarStyles = {
   sidebarContainer: {
      className: 'sidebar-container',
      height: '100vh',
      flex: { lg: '2', md: '2.5', xs: '4' },
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: '25vw'
   },
   // Navbar
   navbar: {
      px: 2,
      bgcolor: theme.palette.grey.light,
      height: '10vh',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

   },
   buttonsContainer: {
      marginLeft: 'auto',
      flex: { lg: 0.5, md: 0.6, sm: 0.7, xs: 0.6 },
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
   },
   iconContainer: {
      color: theme.palette.grey.middle,
      width: '20px',
      fontSize: '1.4rem',
      display: 'inline-block',
      position: 'relative',
      sx: {
         cursor: 'pointer',
      }
   },
   chipdx: {
      marginLeft: '10px',
   },
   friendsNotification: {
      position: 'absolute',
      right: '-70%',
      height: '10px',
      width: '10px',
      borderRadius: '5px',
      bgcolor: theme.palette.error.light
   },


   searchbar: {
      width: '100%',
      height: '10vh',
      minHeight: '80px',
      display: { md: 'flex', sm: 'flex', xs: 'flex' },
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
   },
   resultsContainer: {
      bgcolor: theme.palette.background,
      minHeight: '80vh',
      width: '100%',
   },
   resultWrapper: {
      height: '80px',
      maxHeight: '80px',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      sx: {
         cursor: 'pointer',
         '&:hover': {
            bgcolor: theme.palette.grey.light,
         }
      }
   }
};

export const chatStyles = {
   chatsContainer: {
      bgcolor: theme.palette.background,
      height: '80vh',
      p: 0,
      overflow: "scroll",
   },
   chatWrapper: {
      height: '80px',
      maxHeight: '80px',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
      sx: {
         cursor: 'pointer',
         '&:hover': {
            bgcolor: theme.palette.grey.light,
         }
      }
   },
   chatContainer: {
      className: "chat",
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.grey.light}`
   },
   chatContentContainer: {
      flex: 1,
      marginLeft: '20px',
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '80%',
   },
   chatTextContainer: {
      flex: 1,
      textOverflow: "ellipsis", overflow: "hidden"
   },
   timestampContainer: {
      marginLeft: 'auto',
      marginTop: '10px',
      textOverflow: "ellipsis", overflow: "hidden",
      color: theme.palette.grey.middle
   },
   Typstyle: {
      maxHeight: '20px',
      maxWidth: '100%',
      variant: 'caption',
      component: 'p',
      flex: 1,
      textOverflow: "ellipsis", overflow: "hidden"
   },

   unreadChat: {
      bgcolor: theme.palette.secondary.light
   }
}

export const activeChatStyles = {
   activeChatContainer: {
      className: 'active-chat',
      flex: { lg: '5', md: '5', sm: '5', xs: '1' },
      height: '100vh',
      flexDirection: 'column',
      overflow: 'hidden',
   },
   topBar: {
      bgcolor: theme.palette.grey.light,
      px: 2,
      height: '10vh',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
   },
   iconContainer: {
      color: theme.palette.grey.middle,
      fontSize: '1.4rem',
      marginLeft: 'auto',
      marginRight: '20px',
      sx: {
         cursor: 'pointer',
         '&:hover': {
            color: theme.palette.error.main,
         }
      }
   },
   messagesContainer: {
      bgcolor: '#ffffff',
      p: 2,
      px: 4,
      spacing: 0.5,
      flex: 10,
      maxHeight: '100%',
      maxWidth: '100%',
      overflow: 'auto',
   },
   messageBox: {
      bgcolor: theme.palette.secondary.main,
      maxWidth: '55%',
      padding: '1px',
      display: 'flex',
      flexDirection: "row",
      alignItems: "flex-end",
      borderRadius: '10px',
      boxShadow: theme.palette.shadow,
   },
   inputContainer: {
      className: 'send-container',
      flex: 1,
      px: 3,
      paddingBottom: 2,
      paddingTop: 0,
      bgcolor: theme.palette.background,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
   },

   // Typography
   messageContent: {
      className: 'messageContent',
      mx: 1,
      my: 0.5,
      fontSize: '0.9rem',
   },
   messageTimestamp: {
      mx: 1,
      fontSize: '0.7rem'
   },
   date: {
      className: 'date-container',
      // position: '-webkit-sticky',
      position: 'sticky',
      zIndex: '10',
      top: 10,
      left: { lg: '45%', md: '45%', sm: '45%', xs: '35%' },
      bgcolor: theme.palette.grey.light,
      maxWidth: '70px',
      padding: '5px 10px',
      borderRadius: '5px'
   }

};


export const friendlistStyles = {
   mainContainer: {
      maxHeight: '100vh',
      flex: { lg: 5, md: 5, sm: 5, xs: 5 },
      display: 'flex',
      flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
      overflow: 'hidden'
   },

   // Lista amici
   friendsContainer: {
      bgcolor: theme.palette.background,
      maxHeight: '80vh',
      minHeight: '30vh',
      p: 0,
      overflow: "scroll",
   },

   friendContainer: {
      height: '80px',
      px: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   friend: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.grey.light}`,
   },
   chip: {
      marginLeft: 'auto',
   },
   buttonsContainer: {
      marginLeft: 'auto',
      display: 'flex',
      flexDirection: 'row',
   },
   iconContainer: {
      className: 'icon-container',
      color: theme.palette.grey.middle,
      fontSize: '1.5rem',
      marginLeft: 'auto',
      marginRight: '20px',
      sx: {
         cursor: 'pointer',
      },
   },
   acceptIcon: {
      '&:hover': {
         cursor: 'pointer',
         color: theme.palette.success.main,
      }

   },
   rejectIcon: {
      '&:hover': {
         cursor: 'pointer',
         color: theme.palette.error.main,
      }
   },

   // Sezione richieste ricevute e inviate
   requestsContainer: {
      flex: 1,
      bgcolor: theme.palette.background,
      overflow: "hidden",
      display: 'flex',
      flexDirection: 'column'
   },
   topBar: {
      bgcolor: theme.palette.grey.light,
      px: 2,
      height: { lg: '10vh', md: '10vh', sm: '10vh', xs: '5vh' },
      minHeight: { lg: '80px', md: '80px', sm: '80px', xs: '60px' },
      display: 'flex',
      alignItems: 'center',
   },
   entriesContainer: {
      bgcolor: theme.palette.secondary,
      height: { lg: '90vh', md: '90vh', sm: '90vh', xs: '40vh' },
      overflow: "scroll",
   },
   entryContainer: {
      height: '80px',
      px: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },

   username: {
      fontSize: '1rem'
   },
   subtitle: {
      fontSize: { lg: '1.2rem', md: '1.2rem', sm: '1.2rem', xs: '1rem' }
   },
}