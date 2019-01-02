
import _ from '@jmaguirrei/belt';
import { sendEmail } from '../:emails';
import * as emails from '/server/lib/emails';

export const forgotSendTokenEmail = {

  run(args, model, catcher) {

    const {
      _id,
      name,
      email,
      language,
    } = args;

    const forgotToken = String(_.random(100001, 999999));
    const emailArgs = emails.forgotToken({ token: forgotToken, email, language, name });

    return sendEmail.run(emailArgs, model, catcher)
    .then(() => {
      return model.addAttrsToEntity({
        _id,
        attrs: [
          { key: 'forgotToken', value: forgotToken },
        ],
      });
    })
    .catch(catcher);

  }

};
