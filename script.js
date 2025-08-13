        const URL = "https://teachablemachine.withgoogle.com/models/opLIKGO51/";

        let model, webcam,isOn = false;

        document.getElementById("toggleBtn").addEventListener("click", function () {
            if (!isOn) {
                ligarCamera();
                this.textContent = "Desligar Câmera";
            } else {
                desligarCamera();
                this.textContent = "Ligar Câmera";
            }
            isOn = !isOn;
        });

        async function ligarCamera() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            model = await tmImage.load(modelURL, metadataURL);
            webcam = new tmImage.Webcam(400, 400, true);

            await webcam.setup();
            await webcam.play();

            document.getElementById("webcam-container").appendChild(webcam.canvas);
            window.requestAnimationFrame(loop);
        }

        function desligarCamera() {
            if (webcam) {
                webcam.stop();
                document.getElementById("webcam-container").innerHTML = "";
                document.body.style.backgroundColor = ""; // volta cor padrão
            }
        }

        //garante que o estado do script não seja executado se a camera for desligada.
        async function loop() {
            if (!isOn) return; //impede a execução se desligar
            webcam.update();
            await predict(); 
            window.requestAnimationFrame(loop);
            }

        async function predict() {
            const prediction = await model.predict(webcam.canvas);
            console.log(prediction);

            const aberta = prediction.find(p => p.className.toLowerCase().includes("aberta"));
            const fechada = prediction.find(p => p.className.toLowerCase().includes("fechada"));

            if (aberta && aberta.probability > 0.8) {
                document.body.style.backgroundColor = "#4caf50"; //verde
            } else if (fechada && fechada.probability > 0.8) {
                document.body.style.backgroundColor = "#f44336"; //vermelho
            } else {
                document.body.style.backgroundColor = "#ffffff"; //branco
            }
        } 