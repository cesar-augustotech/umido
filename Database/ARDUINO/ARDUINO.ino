#include "DHT.h"                      // importando a biblioteca
#define TIPO_SENSOR DHT11
const int PINO_SENSOR_DHT11 = A0;     // defnindo a porta de captura - variavel do tipo inteiro
      
const int max_u = 100;                // limite max umidade
const int min_u = 20;                 // limite min umidade

DHT sensorDHT(PINO_SENSOR_DHT11, TIPO_SENSOR);  // chama a função da biblioteca


void setup() {          //função de inicializaçõa básica
Serial.begin(9600);     // definir a quantidade de dados da usb
sensorDHT.begin();      // iniciar sensor

}
void loop() {
  float umidade = sensorDHT.readHumidity()            //variavel do tipo float e onde será armazenado o dado de umidade
      
  if (isnan(isnan(umidade))                           // verfica se as variaveis tem dado, caso alguma delas não tenha exibe uma mensagem de erro
  {
    Serial.println("ERRO ao ler os dados do sensor"); // mensage de erro
  } else {   
    Serial.print("umidade:");       // label umidade
    Serial.print(umidade);          // exibe o dado de umidade  
    Serial.print(",");              // separa para a proxima label
    
    Serial.print("Max_umidade:");   // label max umidade
    Serial.print(max_u);            // exibe o dado fixo max de umidade para determinar limite
    Serial.print(",");              // separa para a proxima label   
    Serial.print("Min_umidade:");   // label min umidade
    Serial.println(min_u);          // exibe o dado fixo min de umidade para determinar limite
    
delay(1000); // espera 1 segundo para finalizar







  }
}
