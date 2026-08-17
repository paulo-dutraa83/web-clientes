import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  //Variavel para armazenar o endpoint da api
  private apiUrl = 'http://localhost:8081/api/v1';
  
  //Instanciando a biblioteca HTTP CLIENT
  private http = inject(HttpClient);

  //Variavel signal para armazenar o resultado da consulta
  planos = signal<any[]>([]);

  //Variaveis para exibir mensagens obtidas do cadastro de cliente
  mensagemSucesso = signal('');
  mensagemErro = signal('');

  //Estrutura do formulario de cadastro de clientes
  formCadastro = new FormGroup({
    nome : new FormControl('', [Validators.required, Validators.minLength(6)]),
    email : new FormControl('', [Validators.required, Validators.email]),
    cpf : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]),
    planoId : new FormControl('', [Validators.required]),
  }); 

  //Função reservada do Angular que eh executada qdo o componente eh inicializado
  ngOnInit() {
    //Fazendo uma chamada HTTP GET para a API de consulta de planos
    this.http.get(this.apiUrl + '/planos')
      .subscribe((consulta) => { //Capturando a resposta d API
        this.planos.set(consulta as any[]); //Armazenar o resultado da consulta na variavel signal
      });

  }

  //Função para cadastrar um novo cliente
  cadastrarCliente() {

    //Limpando as mensagens
    this.mensagemSucesso.set('');
    this.mensagemErro.set('');

    //Fazendo uma chamada HTTP POST para a API de cedastro de cliente
    this.http.post(this.apiUrl + '/clientes', this.formCadastro.value, { responseType: 'text' })
      .subscribe({ //aguardando a resposta da API
        next: (resposta) => { //Capturando a resposta de sucesso
          this.mensagemSucesso.set(resposta);
          this.formCadastro.reset();
        },
        error: (e) => { //Capturando a resposta de erro
          this.mensagemErro.set(e.error);
        }
      })
  }  

}
