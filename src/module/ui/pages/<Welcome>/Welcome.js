import _ from '@jmaguirrei/belt';import { ui } from '/module/context';/* --------------------------------------------------------------------------------------------- */const { Button } = ui.components;const { Header } = ui.fragments;/* --------------------------------------------------------------------------------------------- */export default ui.hoc({  state(props, store) {    return {      language: store.get('language'),      user_id: store.get('user_id'),    };  },  styles: {    wrapper: `      display: flex;      flex-flow: column;      height: 100%;      justify-content: space-between;      align-items: center;      padding-bottom: 20%;    `,    title: `      font-size: 28px;      padding: 20px 20px 10px 20px;    `,    subtitle: `      font-size: 22px;      padding: 10px 20px 20px 20px;      color: hsl(0, 0%, 35%);    `,    button: `      padding: 60px;      width: 100%;      font-size: 20px;    `,  },  render({ state, styles }) {    const { language, user_id } = state;    return ui.html`      <div id='welcome' style=${styles.wrapper}>        ${Header()}        <div style=${styles.title}>          ${            _.get({              en: 'Welcome!',              es: '¡Bienvenid@!',            }, language)          }        </div>        <div style=${styles.subtitle}>          ${            _.get({              en: 'You successfully registered your account',              es: 'Has registrado exitosamente tu cuenta',            }, language)          }        </div>        <div style=${styles.button}>          ${            Button({              text: _.get({                en: 'Open the app',                es: 'Abrir la app',              }, language),              color: 'white',              bgColor: ui.lib.Colors.GREEN_WELCOME,              height: 44,              href: `/app?user=${user_id}`,            })          }        </div>      </div>    `;  }});