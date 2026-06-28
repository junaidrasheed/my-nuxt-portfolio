export default defineAppConfig({
  global: {
    picture: {
      dark: '/avatars/me.png',
      light: '/avatars/me.png',
      alt: 'My profile picture'
    },
    meetingLink: 'https://cal.com/',
    email: 'junaidrasheed1@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'tangerine',
      neutral: 'lagoon'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with Nuxt UI • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://discordapp.com/users/651017553937694741',
      'target': '_blank',
      'aria-label': 'Discord'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/junaid-rasheed-088382109/',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/junaidrasheed',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  }
})
