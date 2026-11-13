import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [
    CommonModule, //Funções lógicas do Angular para manipulação de elementos HTML
    FormsModule, //Funções básicas de formulários
    ReactiveFormsModule //Formulários reativos
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

    //Inicializar a biblioteca HttpClient do angular
    private http = inject(HttpClient);

    //Atributo privado para armazenar o endereço da API
    private apiUrl = 'http://localhost:8080/api/v1/clientes';

    //Função para armazenar os dados dos clientes obtidos
    clientes = signal<any[]>([]);

    //Função executada sempre que o componente é inicializado
    ngOnInit() {
      //Fazendo uma requisição HTTP GET para a URL de consulta de clientes
      this.http.get(this.apiUrl)
        .subscribe((clientes) => {
          //Imprimindo os clientes obtidos no console do navegador
          this.clientes.set(clientes as any[]);
        });
    }  

    //Formulário para cadastro de clientes
    formCadastro = new FormGroup({
        nome : new FormControl('', [Validators.required, Validators.minLength(6)]),
        email : new FormControl('', [Validators.required, Validators.email]),
        telefone : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]),
        cpf : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)])
    });

    //Formulário para edição de clientes
    formEdicao = new FormGroup({
        id : new FormControl(''), //Armazenando o ID do cliente a ser editado
        nome : new FormControl('', [Validators.required, Validators.minLength(6)]),
        email : new FormControl('', [Validators.required, Validators.email]),
        telefone : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]),
        cpf : new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{11}$/)])
    });

    //Função para realizar o cadastro do cliente
    cadastrarCliente() {
        //Fazendo uma chamada HTTP POST para inserir um cliente na API
        this.http.post(this.apiUrl, this.formCadastro.value, { responseType: 'text' })
          .subscribe((mensagem) => {
              //Exibir a mensagem em uma popup
              alert(mensagem);
              //Limpar os campos do formulário
              this.formCadastro.reset();
              //Fazer uma nova consulta na API
              this.ngOnInit();
          });
    }

    //Função para realizar a exclusão do cliente
    excluirCliente(id: string) {

      //Solicitar a confirmação do usuário
      if(confirm('Deseja realmente excluir este cliente?')) {

        //Enviar uma requisição HTTP DELETE para a API
        this.http.delete(this.apiUrl + '/' + id, { responseType : 'text' })
          .subscribe((mensagem) => { //Capturando a mensagem obtida
            alert(mensagem); //Exibir a mensagem para o usuário
            this.ngOnInit(); //Fazer uma nova consulta na API
          });
      }
    }

    //FUnção para carregar os dados do cliente selecionado para edição
    obterCliente(id : string) {
      //Fazendo uma requisição HTTP GET para obter os dados do cliente
      this.http.get(this.apiUrl + '/' + id)
        .subscribe((cliente) => { //Aguardando o retorno da API
          //Preenchendo o formulario de edição com os dados do cliente
          this.formEdicao.patchValue(cliente);
        });
    }  

    //Função para atualizar os dados do cliente na API
    atualizarCliente() {
      //Fazendo uma requisição HTTP PUT para atualizar os dados do cliente
      this.http.put(this.apiUrl + '/' + this.formEdicao.value.id, this.formEdicao.value, { responseType : 'text' })
        .subscribe((mensagem) => { //Aguardando o retorno da API
          alert(mensagem); //Exibindo a mensagem para o usuário
          this.ngOnInit(); //Fazendo uma nova consulta na API
        });
    }
  
}
