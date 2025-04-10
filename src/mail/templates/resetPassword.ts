export const resetPasswordTemplate = (subject, name, resetUrl) => `
<!DOCTYPE html>
<html lang="pt-BR">
  <head>ac
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${subject}</title>
    <style>
      @media only screen and (max-width: 620px) {
        table[class="body"] h2 {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        table[class="body"] p,
        table[class="body"] a {
          font-size: 16px !important;
        }
        table[class="body"] .wrapper,
        table[class="body"] .main {
          padding: 10px !important;
        }
        table[class="body"] .container {
          width: 100% !important;
        }
        table[class="body"] .btn a {
          width: 100% !important;
        }
      }

      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          text-decoration: none !important;
        }
        .btn-primary table td:hover {
          background-color: #513e9f !important;
        }
        .btn-primary a:hover {
          background-color: #513e9f!important;
          border-color: #513e9f !important;
        }
      }
    </style>
  </head>

  <body style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
      <tr>
        <td valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
          <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Ative sua conta</span>

            <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
              <tr>
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                    <tr>
                      <td align="center" valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center; padding-bottom: 20px;">
                        <img src="https://soterrenos-1076594788065.us-central1.run.app/logos/logo.png" alt="Logo" height="50" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;" />
                      </td>
                    </tr>
                    <tr>
                      <td valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                        <h2 style="color: #06090f; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0 0 30px;">Olá ${name},</h2>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0 0 15px; color: #333;">Clique no botão abaixo para redefinir sua senha:</p>

                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="box-sizing: border-box; min-width: 100%; width: 100%;" width="100%">
                          <tbody>
                            <tr>
                              <td align="center" valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: auto; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="auto">
                                  <tbody>
                                    <tr>
                                      <td align="center" bgcolor="#513e9f" valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #513e9f;">
                                        <a href="${resetUrl}" target="_blank" style="border: solid 1px #513e9f; border-radius: 5px; box-sizing: border-box; color: #ffffff; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #513e9f; border-color: #513e9f;">Redefinir minha senha</a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0 0 15px; color: #888;">Se você não solicitou esta ação, ignore este email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                <tr>
                  <td class="content-block" align="center" valign="top" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;">
                    <span class="apple-link" style="color: #9a9ea6; font-size: 12px; text-align: center;">Não se esqueça de adicionar seu endereço aqui</span>
                    <br />
                    <a href="#" style="text-decoration: underline; color: #513e9f; font-size: 12px; text-align: center;">Cancelar inscrição</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </td>
        <td valign="top" style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>
`