// import _ from '@jmaguirrei/belt';export default Store => () => {  const email = Store.observables['forgot.email'];  return {    steps: [      () => ({        domain: '_Backend_',        method: 'forgotValidateEmail',        optimistic: false,        args: {          email,        },      }),      res => ({        domain: '_Store_',        method: res.error ? 'alertOn' : 'set',        args: res.error ? {          name: res.error,          timeout: 4000,        } : {          user_id: res.data.user_id,          'forgot.name': res.data.name,          'forgot.currentStep': 1,        },      }),      res => ({        domain: '_Store_',        method: 'set',        args: res.error ? {          'signup.email': email,        } : null,      }),    ],  };};