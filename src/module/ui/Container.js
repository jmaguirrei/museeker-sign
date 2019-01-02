import { ui } from '/module/context';import SignIn from './pages/<SignIn>/SignIn';import SignUp from './pages/<SignUp>/SignUp';import Welcome from './pages/<Welcome>/Welcome';import Forgot from './pages/<Forgot>/Forgot';/* --------------------------------------------------------------------------------------------- */const { Modal, NotFound } = ui.components;export default ui.hoc({  state(props, store) {    return {      currentPage: store.get('currentPage') || props.router.currentPage,    };  },  render({ props, state }) {    const { pages } = props.router;    const { currentPage } = state;    const findRoute = pages.includes(currentPage);    if (!findRoute) return ui.html`${NotFound()}`;    return ui.html`      <div id='page-wrapper'>        ${          Modal({            currentPage,            pages: {              signin: SignIn,              signup: SignUp,              welcome: Welcome,              forgot: Forgot,            }          })        }      </div>    `;  }});