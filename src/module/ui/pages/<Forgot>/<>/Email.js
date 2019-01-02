import _ from '@jmaguirrei/belt';import { ui } from '/module/context';import { ForgotControl } from '../Forgot';const { Input } = ui.components;export default ui.hoc({  state(props, store) {    return {      language: store.get('language'),      email: store.get('forgot.email'),    };  },  actions(props, store) {    return {      onInput: e => {        const email = e.target.value;        store.set({ 'signin.email': email, 'forgot.email': email });      },      onClickRight: () => {        const { state, actions } = ForgotControl(store);        const enabled = state.rightEnabled;        if (enabled) actions.onClickRight();      },    };  },  styles: {    wrapper: `      display: flex;      flex-flow: column;      height: 100%;      justify-content: space-around;    `,    title: `      font-size: 28px;      padding: 20px 20px 10px 20px;    `,    subtitle: `      font-size: 24px;      padding: 10px 20px 20px 20px;    `,  },  render({ actions, state, styles }) {    const { language } = state;    return ui.html`      <div style=${styles.wrapper}>        <div>          <div style=${styles.title}>            ${_.get({              en: 'Password recovery',              es: 'Recuperación de contraseña',            }, language)}          </div>          <div style=${styles.subtitle}>            ${_.get({              en: 'Enter your email',              es: 'Ingresa tu email',            }, language)}          </div>        </div>        ${Input({          type: 'text',          placeholder: _.get({ en: 'Your email', es: 'Tu email' }, language),          value: state.email,          onInput: actions.onInput,          onClickRight: actions.onClickRight,        })}      </div>    `;  }});