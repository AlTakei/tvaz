// const { Telegraf, session, Markup, Scenes: { BaseScene, Stage } } = require('telegraf');

// const bot = new Telegraf('6736650314:AAGRWiEURqovSTKGTjTzV2izI4Q85n7ELxc');

// // IDs de chat para los ingenieros
// const engineerChatIds = ['1732913486'];

// let conversationId = 0; // Inicializar el ID de la conversación

// // Definir una escena para recopilar información
// const infoScene = new BaseScene('infoScene');

// // Definir los pasos de la escena
// infoScene.enter((ctx) => {
//     conversationId++; // Incrementar el ID de la conversación
//     ctx.session.conversationId = conversationId; // Asignar el ID de la conversación a la sesión
//     ctx.session.info = {}; // Reiniciar la información de la sesión
//     ctx.reply(`ID# ${ctx.session.conversationId}: \n¡Hola! Soy un bot con el fin de brindarte un servicio personalizado. \nPor favor, responde a las siguientes preguntas:`);
//     ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cuál es tu nombre?`);
// });

// infoScene.on('text', (ctx) => {
//     const messageText = ctx.message.text;
//     const { info } = ctx.session;

//     // Validar la información ingresada
//     if (!info.name) {
//         info.name = messageText;
//         ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cuál es tu número de empleado?`);
//     } else if (!info.employeeNumber) {
//         info.employeeNumber = messageText;
//         ctx.reply(`ID# ${ctx.session.conversationId}: \n¿En qué área trabajas? \nSelecciona una de las opciones: \n/Ventas \n/Administracion \n/Marketing \n/Noticias \n/Master \n/Cabina`, 
//         Markup.keyboard([
//             ['Ventas', 'Administracion', 'Marketing'],
//             ['Noticias', 'Master', 'Cabina']
//         ]).oneTime().resize());
//     } else if (!info.area) {
//         if (!['Ventas', 'Administracion', 'Marketing', 'Noticias', 'Master', 'Cabina'].includes(messageText)) {
//             ctx.reply('Por favor, selecciona una opción válida del teclado.');
//             return;
//         }
//         info.area = messageText;
//         ctx.reply(`ID# ${ctx.session.conversationId}:  \n¿En qué problema puedo ayudarte en relación con el área ${ctx.session.info.area}? \nDescribe tu problema:`);
//     } else if (!ctx.session.info.problem) {
//         ctx.session.info.problem = ctx.message.text;
//         ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Tienes otro problema?`, 
//             Markup.keyboard([
//                 ['Sí', 'No']
//             ]).resize());
//     } else if (ctx.message.text === 'Sí') {
//         ctx.reply(`ID# ${ctx.session.conversationId}: \nPor favor, describe el nuevo problema.`);
//     } else if (ctx.message.text === 'No') {
//         ctx.reply(`ID# ${ctx.session.conversationId}: \nTu problema ha sido enviado al ingeniero.`);
//         // Simular el envío al ingeniero aquí
//         const problemMessage = `ID# ${ctx.session.conversationId}: Nuevo problema recibido\n\nNombre del usuario: ${info.name}\nNúmero de empleado: ${info.employeeNumber}\nÁrea: ${info.area}\nProblema: ${info.problem}`;
//         engineerChatIds.forEach((chatId) => {
//             bot.telegram.sendMessage(chatId, problemMessage, {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{ text: 'Sí, se solucionó', callback_data: `solved:${conversationId}` }],
//                         [{ text: 'No, se solucionó', callback_data: `not_solved:${conversationId}` }]
//                     ]
//                 }
//             });
//         });
//         ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cómo calificarías tu experiencia? \n\n👍 Excelente 👌 Bueno 👎 Malo`, 
//         Markup.keyboard([
//             ['👍 Excelente', '👌 Bueno', '👎 Malo']
//         ]).oneTime().resize());
//     } else if (['👍 Excelente', '👌 Bueno', '👎 Malo'].includes(messageText)) {
//         if (!info.rating) {
//             info.rating = messageText;
//             ctx.reply(`Gracias por tu valoración: ${info.rating}`);
//             ctx.scene.leave();
//         }
//     } else if (ctx.session.info.problem && ctx.message.text !== 'Sí' && ctx.message.text !== 'No') {
//         // Añadir el nuevo problema a la lista
//         ctx.session.info.problem += `; ${ctx.message.text}`;
//         ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Tienes otro problema?`, 
//             Markup.keyboard([
//                 ['Sí', 'No']
//             ]).resize());
//     } else if (!info.rating) {
//         if (!['👍 Excelente', '👌 Bueno', '👎 Malo'].includes(messageText)) {
//             ctx.reply('Por favor, selecciona una valoración válida del teclado.');
//             return;
//         }
//         info.rating = messageText;
//         ctx.reply(`Gracias por tu valoración: ${info.rating}`);
//         ctx.scene.leave();
//     }
// });


// // Manejar el envío de archivos multimedia
// infoScene.on(['photo', 'video', 'audio'], (ctx) => {
//     const fileType = ctx.message.video ? 'video' : (ctx.message.audio ? 'audio' : 'photo');
//     const fileCaption = `ID# ${ctx.session.conversationId}: \n¡Se ha recibido el ${fileType}! Por favor, confirma tu elección escribiendo: ok.`;
//     const fileId = ctx.message[fileType].file_id;
//     ctx.session.info.problem = fileId;
//     bot.telegram.sendDocument(ctx.chat.id, fileId, { caption: fileCaption })
//         .then(() => {
//             console.log('Documento enviado exitosamente');
//         })
//         .catch((error) => {
//             console.error('Error al enviar el documento:', error);
//         });
// });


// bot.command('senddoc', (ctx) => {
//     // Asegúrate de que el documento existe y es accesible
//     const document = 'ruta/al/documento/documento.pdf';
//     ctx.replyWithDocument({ source: fs.createReadStream(document) })
//         .catch((error) => {
//             console.error('Error al enviar el documento:', error);
//         });
// });

// // Luego, en tus acciones de botón, puedes extraer el ID de la conversación del `callback_data`
// bot.action(/solved:(.+)/, (ctx) => {
//     const conversationId = ctx.match[1]; // Extraer el ID de la conversación del callback_data
//     const senderId = ctx.callbackQuery.message.chat.id; // Usar el ID del chat original
//     bot.telegram.sendMessage(senderId, `¡El problema del mensaje ID#${conversationId} se ha solucionado!`);
// });

// bot.action(/not_solved:(.+)/, (ctx) => {
//     const conversationId = ctx.match[1]; // Extraer el ID de la conversación del callback_data
//     const senderId = ctx.callbackQuery.message.chat.id; // Usar el ID del chat original
//     bot.telegram.sendMessage(senderId, `El problema del mensaje ID#${conversationId} aún no se ha solucionado.`);
// });

// // Registrar la escena en el bot
// const stage = new Stage([infoScene]);
// bot.use(session());
// bot.use(stage.middleware());

// // Iniciar el bot
// bot.start((ctx) => ctx.scene.enter('infoScene'));
// // Controlador para el comando /helpbot1.js
// bot.help((ctx) => {
//     ctx.reply(`ID ${ctx.session.conversationId}: Si escribes el comando /start, comenzará la conversación.`);
// });
// // Controlador para el iniciar la conversación con el bot
// bot.on('text', (ctx) => ctx.reply(`ID# ${ctx.session.conversationId}: \n¡Bienvenido! Puedes usar los siguientes comandos:\n/start - Iniciar la conversación\n/help - Obtener ayuda`,
//     Markup.keyboard([
//         ['/start', '/help']
//     ]).resize()));

// bot.launch();


const { Telegraf, session, Markup, Scenes: { BaseScene, Stage } } = require('telegraf');

const bot = new Telegraf('6736650314:AAGRWiEURqovSTKGTjTzV2izI4Q85n7ELxc');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// URL de la imagen a descargar
const url = 'https://ejemplo.com/imagen.jpg';

// Ruta donde se guardará la imagen
const ruta = path.resolve(__dirname, 'images', 'imagen.jpg');

// Descargar la imagen
axios({
    url,
    responseType: 'stream',
})
.then(response =>
    new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(ruta))
            .on('finish', () => resolve())
            .on('error', e => reject(e));
    }),
)
.catch(error => {
    console.error('Error al descargar la imagen:', error);
});

// IDs de chat para los ingenieros
const engineerChatIds = ['1732913486'];

let conversationId = 0; // Inicializar el ID de la conversación

// Definir una escena para recopilar información
const infoScene = new BaseScene('infoScene');

// Definir los pasos de la escena
infoScene.enter((ctx) => {
    conversationId++; // Incrementar el ID de la conversación
    ctx.session.conversationId = conversationId; // Asignar el ID de la conversación a la sesión
    ctx.session.info = {}; // Reiniciar la información de la sesión
    ctx.reply(`ID# ${ctx.session.conversationId}: \n¡Hola! Soy un bot con el fin de brindarte un servicio personalizado. \nPor favor, responde a las siguientes preguntas:`);
    ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cuál es tu nombre?`);
});

infoScene.on('text', (ctx) => {
    const messageText = ctx.message.text;
    const { info } = ctx.session;

    // Validar la información ingresada
    if (!info.name) {
        info.name = messageText;
        ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cuál es tu número de empleado?`);
    } else if (!info.employeeNumber) {
        info.employeeNumber = messageText;
        ctx.reply(`ID# ${ctx.session.conversationId}: \n¿En qué área trabajas? \nSelecciona una de las opciones: \n/Ventas \n/Administracion \n/Marketing \n/Noticias \n/Master \n/Cabina`, 
        Markup.keyboard([
            ['Ventas', 'Administracion', 'Marketing'],
            ['Noticias', 'Master', 'Cabina']
        ]).oneTime().resize());
    } else if (!info.area) {
        if (!['Ventas', 'Administracion', 'Marketing', 'Noticias', 'Master', 'Cabina'].includes(messageText)) {
            ctx.reply('Por favor, selecciona una opción válida del teclado.');
            return;
        }
        info.area = messageText;
        ctx.reply(`ID# ${ctx.session.conversationId}:  \n¿En qué problema puedo ayudarte en relación con el área ${ctx.session.info.area}? \nDescribe tu problema:`);
    } else if (!ctx.session.info.problem) {
        ctx.session.info.problem = ctx.message.text;
        ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Tienes otro problema?`, 
            Markup.keyboard([
                ['Sí', 'No']
            ]).resize());
    } else if (ctx.message.text === 'Sí') {
        ctx.reply(`ID# ${ctx.session.conversationId}: \nPor favor, describe el nuevo problema.`);
    } else if (ctx.message.text === 'No') {
        ctx.reply(`ID# ${ctx.session.conversationId}: \nTu problema ha sido enviado al ingeniero.`);
        // Simular el envío al ingeniero aquí
        const problemMessage = `ID# ${ctx.session.conversationId}: Nuevo problema recibido\n\nNombre del usuario: ${info.name}\nNúmero de empleado: ${info.employeeNumber}\nÁrea: ${info.area}\nProblema: ${info.problem}`;
        engineerChatIds.forEach((chatId) => {
            bot.telegram.sendMessage(chatId, problemMessage, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Sí, se solucionó', callback_data: `solved:${conversationId}` }],
                        [{ text: 'No, se solucionó', callback_data: `not_solved:${conversationId}` }]
                    ]
                }
            });
        });
        ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Cómo calificarías tu experiencia? \n\n👍 Excelente 👌 Bueno 👎 Malo`, 
        Markup.keyboard([
            ['👍 Excelente', '👌 Bueno', '👎 Malo']
        ]).oneTime().resize());
    } else if (['👍 Excelente', '👌 Bueno', '👎 Malo'].includes(messageText)) {
        if (!info.rating) {
            info.rating = messageText;
            ctx.reply(`Gracias por tu valoración: ${info.rating}`);
            ctx.scene.leave();
        }
    } else if (ctx.session.info.problem && ctx.message.text !== 'Sí' && ctx.message.text !== 'No') {
        // Añadir el nuevo problema a la lista
        ctx.session.info.problem += `; ${ctx.message.text}`;
        ctx.reply(`ID# ${ctx.session.conversationId}: \n¿Tienes otro problema?`, 
            Markup.keyboard([
                ['Sí', 'No']
            ]).resize());
    } else if (!info.rating) {
        if (!['👍 Excelente', '👌 Bueno', '👎 Malo'].includes(messageText)) {
            ctx.reply('Por favor, selecciona una valoración válida del teclado.');
            return;
        }
        info.rating = messageText;
        ctx.reply(`Gracias por tu valoración: ${info.rating}`);
        ctx.scene.leave();
    }
});


// Manejar el envío de archivos multimedia
infoScene.on(['photo', 'video', 'audio'], (ctx) => {
    const fileType = ctx.message.video ? 'video' : (ctx.message.audio ? 'audio' : 'photo');
    const fileCaption = `ID# ${ctx.session.conversationId}: \n¡Se ha recibido el ${fileType}! Por favor, confirma tu elección escribiendo: ok.`;
    const fileId = ctx.message[fileType].file_id;
    ctx.session.info.problem = fileId;
    bot.telegram.sendDocument(ctx.chat.id, fileId, { caption: fileCaption })
        .then(() => {
            console.log('Documento enviado exitosamente');
        })
        .catch((error) => {
            console.error('Error al enviar el documento:', error);
        });
});


bot.command('senddoc', (ctx) => {
    // Asegúrate de que el documento existe y es accesible
    const document = 'ruta/al/documento/documento.pdf';
    ctx.replyWithDocument({ source: fs.createReadStream(document) })
        .catch((error) => {
            console.error('Error al enviar el documento:', error);
        });
});

// Luego, en tus acciones de botón, puedes extraer el ID de la conversación del `callback_data`
bot.action(/solved:(.+)/, (ctx) => {
    const conversationId = ctx.match[1]; // Extraer el ID de la conversación del callback_data
    const senderId = ctx.callbackQuery.message.chat.id; // Usar el ID del chat original
    bot.telegram.sendMessage(senderId, `¡El problema del mensaje ID#${conversationId} se ha solucionado!`);
});

bot.action(/not_solved:(.+)/, (ctx) => {
    const conversationId = ctx.match[1]; // Extraer el ID de la conversación del callback_data
    const senderId = ctx.callbackQuery.message.chat.id; // Usar el ID del chat original
    bot.telegram.sendMessage(senderId, `El problema del mensaje ID#${conversationId} aún no se ha solucionado.`);
});

// Registrar la escena en el bot
const stage = new Stage([infoScene]);
bot.use(session());
bot.use(stage.middleware());

// Iniciar el bot
bot.start((ctx) => ctx.scene.enter('infoScene'));
// Controlador para el comando /helpbot1.js
bot.help((ctx) => {
    ctx.reply(`ID ${ctx.session.conversationId}: Si escribes el comando /start, comenzará la conversación.`);
});
// Controlador para el iniciar la conversación con el bot
bot.on('text', (ctx) => ctx.reply(`ID# ${ctx.session.conversationId}: \n¡Bienvenido! Puedes usar los siguientes comandos:\n/start - Iniciar la conversación\n/help - Obtener ayuda`,
    Markup.keyboard([
        ['/start', '/help']
    ]).resize()));

bot.launch();









