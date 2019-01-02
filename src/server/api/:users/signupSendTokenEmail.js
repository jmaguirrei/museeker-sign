
import _ from '@jmaguirrei/belt';
import { sendEmail } from '../:emails';
import * as emails from '/server/lib/emails';


export const signupSendTokenEmail = {

  run(args, model, catcher) {

    const {
      _id,
      name,
      email,
      language,
    } = args;

    const signupToken = String(_.random(100001, 999999));
    const emailArgs = emails.signupToken({ token: signupToken, email, language, name });

    return sendEmail.run(emailArgs, model, catcher)
    .then(() => {
      return model.addAttrsToEntity({
        _id,
        attrs: [
          { key: 'signupToken', value: signupToken },
        ],
      });
    })
    .catch(catcher);

  }

};
