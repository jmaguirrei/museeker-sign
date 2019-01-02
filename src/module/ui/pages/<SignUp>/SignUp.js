/* ------------------------------------------------------------------------------------------------===== SIGNUP WORFLOW =====0: NAME1: EMAIL    isRegistered ?    - true: error    - false: continue2: PASSWORD    sendEmail (signupToken)3: TOKEN    - ko: error    - ok: isRegistered, setPassword => Welcome!-------------------------------------------------------------------------------------------------*/import _ from '@jmaguirrei/belt';import { ui } from '/module/context';import Name from './<>/Name';import Email from './<>/Email';import Password from './<>/Password';import Token from './<>/Token';/* --------------------------------------------------------------------------------------------- */const { Navigation, Carrousel } = ui.components;const { Header, Tabs } = ui.fragments;const screens = [ Name, Email, Password, Token ];const numSteps = screens.length;/* --------------------------------------------------------------------------------------------- */export const SignupControl = store => {  const language = store.get('language');  const currentStep = store.get('signup.currentStep');  const currentCheck = _.get({    0: store.check('name', store.get('signup.name')),    1: store.check('email', store.get('signup.email')),    2: store.check('password', store.get('signup.password')),    3: { result: store.get('signup.tokenDigits').length === 6 },  }, currentStep, {});  const checkResult = _.get(currentCheck, 'result', false);  const alert = store.alerts.find(item => item.isVisible);  return {    state: {      currentStep,      leftEnabled: currentStep > 0,      rightEnabled: checkResult,      checkText: _.get(currentCheck, `message.${language}`, ''),      alertText: _.get(alert, `message.${language}`, ''),    },    actions: {      onClickLeft: () => {        // const currentStep = store.get('signup.currentStep');        if (currentStep > 0) store.set({ 'signup.currentStep': currentStep - 1 });      },      onClickRight: () => {        // const currentStep = store.get('signup.currentStep');        if (currentStep === 0) store.set({ 'signup.currentStep': 1 });        if (currentStep === 1) store.call('signupEmail');        if (currentStep === 2) store.call('signupPassword');        if (currentStep === 3) store.call('signupToken');      },    },  };};/* --------------------------------------------------------------------------------------------- */export default ui.hoc({  state(props, store) {    return SignupControl(store).state;  },  actions(props, store) {    return SignupControl(store).actions;  },  classes: {    container: `      display: flex;      flex-flow: column;      justify-content: space-around;      height: 100%;      position: relative;    `,  },  render({ state, actions, classes }) {    const { currentStep, leftEnabled, rightEnabled, checkText, alertText } = state;    const { onClickLeft, onClickRight } = actions;    return ui.html`      <div id='sign-up' class=${classes.container}>        ${Header({ numSteps, currentStep })}        ${Carrousel({ currentStep, screens })}        ${Navigation({          currentPage: 'signup',          onClickLeft,          onClickRight,          leftEnabled,          rightEnabled,          text: alertText || checkText,          color: alertText ? ui.lib.Colors.RED_WARNING : '',        })}        ${Tabs()}      </div>    `;  }});