export const routes = {  _root_: props => require('../client/ui/Container').default(props),  signin: props => require('../client/ui/pages/<SignIn>/SignIn').default(props),  signup: props => require('../client/ui/pages/<SignUp>/SignUp').default(props),  welcome: props => require('../client/ui/pages/<Welcome>/Welcome').default(props),  forgot: props => require('../client/ui/pages/<Forgot>/Forgot').default(props),};