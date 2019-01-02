import _ from '@jmaguirrei/belt';export default Store => () => {  const name = Store.observables['signup.name'];  const email = Store.observables['signup.email'];  const _id = _.uid();  return {    steps: [      () => ({        domain: '_Backend_',        method: 'signupUserWithEmail',        optimistic: false,        args: {          _id,          name,          email,        },      }),      res => ({        domain: '_Store_',        method: res.error ? 'alertOn' : 'set',        args: res.error ? {          name: res.error,          timeout: 4000,        } : {          user_id: res.data._id,          'signup.currentStep': 2,        },      }),      res => ({        domain: '_Store_',        method: 'set',        args: res.error ? {          'signin.email': email,          'forgot.email': email,          // if user goes to signin he has already the email typed        } : null,      }),    ],  };};