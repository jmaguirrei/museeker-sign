
import _ from '@jmaguirrei/belt';

export const PasswordOptions = ui => {

  const { Icons } = ui.components;

  return ui.hoc({

    actions(props, store) {
      return {
        onClickEye: () => store.toggle(`${props.page}.password.isVisible`),
        onClickForgot: () => store.set({ currentPage: 'forgot' }),
      };
    },

    state(props, store) {
      return {
        language: store.get('language'),
        isPasswordVisible: store.get(`${props.page}.password.isVisible`),
        isIconVisible: store.get(`${props.page}.password`).length > 0,
      };
    },

    classes: {
      container: `
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        margin-bottom: 30px;
      `,
    },

    styles: {
      forgot: forgot => `
        font-size: 14px;
        user-select: none;
        flex: 1;
        opacity: ${forgot ? 1 : 0};
        pointer-events: ${forgot ? 'auto' : 'none'};
        cursor: pointer;
      `,
      icon: isVisible => `
        opacity: ${isVisible ? 1 : 0};
        pointer-events: ${isVisible ? 'auto' : 'none'};
      `,
    },

    render({ props, classes, state, actions, styles }) {

      const { isPasswordVisible, isIconVisible, language } = state;
      const { forgot = false } = props;

      return ui.html`
        <div class='password-options ${classes.container}'>
          <div style=${styles.forgot(forgot)} @click=${actions.onClickForgot}>
            ${_.get({
              en: 'Forgot password?',
              es: '¿Olvidaste tu contraseña?',
            }, language)}
          </div>
          ${Icons({
            icon: isPasswordVisible ? 'eye-off' : 'eye-on',
            size: 20,
            onClick: isIconVisible ? actions.onClickEye : () => undefined,
            inStyle: styles.icon(isIconVisible),
          })}
        </div>
      `;
    }

  });

};
