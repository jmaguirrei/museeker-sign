import _ from '@jmaguirrei/belt';import { ui } from '/module/context';import { SignupControl } from '../SignUp';const { Input } = ui.fragments;export default ui.hoc({  state(props, store) {    return {      language: store.get('language'),      name: store.get('signup.name').split(' ')[0],      email: store.get('signup.email'),    };  },  actions(props, store) {    return {      onInput: e => {        store.set({ 'signup.email': e.target.value });      },      onClickRight: () => {        const { state, actions } = SignupControl(store);        const enabled = state.rightEnabled;        if (enabled) actions.onClickRight();      },    };  },  styles: {    wrapper: `      display: flex;      flex-flow: column;      height: 100%;      justify-content: space-around;    `,    title: `      font-size: 28px;      padding: 20px 20px 10px 20px;    `,    subtitle: `      font-size: 24px;      padding: 10px 20px 20px 20px;    `,  },  render({ state, styles, actions }) {    const { language, name, email } = state;    return ui.html`      <div style=${styles.wrapper}>        <div>          <div style=${styles.title}>            ${_.get({              en: `Hello ${name}!`,              es: `¡Hola ${name}!`,            }, language)}          </div>          <div style=${styles.subtitle}>            ${_.get({              en: 'What email do you want to use?',              es: '¿Qué email deseas usar?',            }, language)}          </div>        </div>        ${Input({          type: 'text',          placeholder: _.get({ en: 'Your email', es: 'Tu email' }, language),          value: email,          onInput: actions.onInput,          onClickRight: actions.onClickRight,        })}      </div>    `;  }});