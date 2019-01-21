
import _ from '@jmaguirrei/belt';

export const Tabs = client => {

  const size = client.lib.Sizes.TABS_HEIGHT;
  const { GREEN_SIGNUP, BLUE_SIGNIN } = client.lib.Colors;

  return client.hoc({

    state(props, store) {
      return {
        language: store.get('language'),
        currentPage: store.get('currentPage'),
      };
    },

    actions(props, store) {
      return {
        onSelectSignUp: () => store.call('changeRoute', { page: 'signup', action: 'replace' }),
        onSelectSignIn: () => store.call('changeRoute', { page: 'signin', action: 'replace' }),
      };
    },

    classes: {
      container: `
        display: flex;
        width: 100%;
        align-items: center;
        min-height: ${size};
        max-height: ${size};
      `,
    },

    styles: {
      tab: (i, color, isSelected) => `
        height: ${size};
        padding: 8px 0px;
        flex: 1;
        font-size: 20px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        color: ${isSelected ? color : 'hsl(0, 0%, 40%)'};
        background: ${isSelected ? 'white' : 'hsl(0, 0%, 95%)'};
        border-top: 1px solid hsl(0, 0%, ${isSelected ? 100 : 80}%);
        border-right: ${isSelected && i === 0 ? '1px solid hsl(0, 0%, 80%)' : '1px solid transparent'};
        border-left: ${isSelected && i === 1 ? '1px solid hsl(0, 0%, 80%)' : '1px solid transparent'};
      `,
    },

    render({ styles, actions, state, classes }) {

      const { language, currentPage } = state;
      const { onSelectSignUp, onSelectSignIn } = actions;

      const isSignupSelected = currentPage === 'signup';

      return client.html`
        <div class='tabs ${classes.container}'>
          <button
            style=${styles.tab(0, GREEN_SIGNUP, isSignupSelected)}
            @click=${onSelectSignUp}
          >
            ${_.get({ en: 'Sign Up', es: 'Registro' }, language)}
          </button>
          <button
            style=${styles.tab(1, BLUE_SIGNIN, !isSignupSelected)}
            @click=${onSelectSignIn}
          >
            ${_.get({ en: 'Sign In', es: 'Acceso' }, language)}
          </button>
        </div>
      `;
    }

  });

};
