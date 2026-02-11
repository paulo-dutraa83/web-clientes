import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
    //Criando um objeto da classe HttpClient
    private http = inject(HttpClient);

    //Atributo para armazenar a URL da nossa API
    private apiUrl = 'http://localhost:8081/api/v1/clientes';

    //Atributo para armazenar os dados da nossa consulta de clientes
    clientes = signal<any[]>([]);


    //Criando a estrutura do formulário
    formCadastro = new FormGroup({ //formulario
      nome: new FormControl(''), //campo nome
      email: new FormControl(''), // campo email
      telefone: new FormControl('') // campo telefone
    });

    //Criando a estrutura do formulário de cunsulta
    formConsulta = new FormGroup({
      nome : new FormControl('') // campo 'nome' para consulta 
    });

    //Função para realizar o cadastro do cliente
    cadastrar() {

      //Fazendo uma requisição HTTP POST para a API
      this.http.post(this.apiUrl, this.formCadastro.value, {responseType: 'text'})
        .subscribe((mensagem) => {
            alert(mensagem); //Exibindo a mensagem para o usuário
            this.formCadastro.reset(); //Limpando o formulário
        }); //Aguardando o retorno da requisição
    }

    //Função para realizar a consulta dos clientes
    consultar() {
      //Fazendo uma requisição HTTP GET para a API
      this.http.get(this.apiUrl + '/' + this.formConsulta.value.nome)
        .subscribe((clientes) => { //Aguardando o retorno da requisição
          this.clientes.set(clientes as any[]); //Exibindo os clientes no console
        });
    }

}
