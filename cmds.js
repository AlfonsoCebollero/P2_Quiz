const model= require('./model');

const {log, biglog, errorlog, colorize}= require("./out");

exports.helpCmd = rl => {
	log('Comandos:');
	log(" h/help - Muestra la ayuda.");
	log(" list - Listar los quizzes existentes");
	log(" show <id> - Muestra la pregunta y la respuesta del quiz indicado");
	log(" add - Añadir un nuevo quiz existente");
	log(" delete <id> - Borrar el quiz indicado");
	log(" edit <id> - Editar el quiz indicado");
	log(" test <id> - Probar el quiz indicado");
	log(" p|play - Jugar a preguntas aleatorias de todos los quizzes");
	log(" credits - Créditos");
	log(" q|quiz - Salir del programa.");
	rl.prompt();
};
exports.listCmd = rl => {
	model.getAll().forEach((quiz,id) => {
		log(`[${colorize(id,'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};
exports.showCmd = (rl,id) => {
	
	if( typeof id === "undefined"){
		errorlog(`Falta el parametro id`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>','magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};
exports.testCmd = (rl,id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id`);
    } else {
        try{
            const quiz = model.getByIndex(id);




            rl.question(`${colorize(quiz.question, 'red')}`, answer=>{

                const bien = answer.trim();

            if(bien==quiz.answer){

                log("Su respuesta es correcta");
                rl.prompt();
            }

            else{

                log("Su respuesta es incorrecta");
                rl.prompt();
            }

        });




        }catch(error){
            errorlog(error.message);
            rl.prompt();
        }
    }


};
exports.addCmd = rl => {
	rl.question(colorize('Introduzca una pregunta: ','red'), question => {
		rl.question(colorize('Introduzca una respuesta:  ','red'),answer => {
			model.add(question,answer);
			log(`${colorize('Se ha añadido','magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
	
};
exports.deleteCmd = (rl,id) => {
	if( typeof id === "undefined"){
		errorlog(`Falta el parametro id`);
	} else {
		try{
			 model.deleteByIndex(id);
		} catch(error) {
			errorlog(error.message);
		}
	}


	rl.prompt();
};
exports.playCmd = rl =>
{
    let score = 0;

    let contador = model.count();

    let toBeResolved=[];

    for (i=0; i<model.count(); i++){

        toBeResolved[i]=i;

    }
    const play = () => {
    if(contador===0){
        rl.prompt();

        log(`Fin del juego. Aciertos ${colorize(score,'magenta')}`);


    }
    else{

        let idaux= Math.round(Math.random()*(toBeResolved.length -1));
        let id= toBeResolved[idaux];
        let quiz = model.getByIndex(id);
        toBeResolved.splice(idaux,1);
        contador --;
        rl.question(`${colorize(quiz.question, 'red')}`, answer=>{

            const bien = answer.trim();

        if(bien===quiz.answer){

            score++;
            log(`Su respuesta es correcta Aciertos ${colorize(score,'magenta')}`);

            play();
        }
        else{

            log(`Su respuesta es incorrecta. Fin del juego. Aciertos ${colorize(score,'magenta')}`);
            rl.prompt();
        }


    });

    }
};
    play();
};


exports.editCmd = (rl,id) => {
	if( typeof id === "undefined"){
		errorlog(`Falta el parametro id`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getByIndex(id);

			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			rl.question(colorize('Introduzca una pregunta: ','red'),question =>{

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				
				rl.question(colorize('Introduzca una respuesta:  ','red'),answer => {
					model.update(id,question,answer);
					log(`Se ha cambiado el quiz ${colorize(id,'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
					rl.prompt();
				});
			});
		} catch(error){
			errorlog(error.message);
			rl.prompt();
		}
	}
};
exports.quitCmd=rl => {
	r1.close();

};


exports.creditsCmd = rl => {
	log("Autores de la practica: ");
    log("DANIEL Lledó Raigal",'green');
   	log("ALFONSO Cebollero Massia",'green');
   	rl.prompt();
};