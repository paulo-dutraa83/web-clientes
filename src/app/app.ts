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

    //Atributo para guardar os dados  do cliente que será alterado
    cliente = signal<any | null>(null); //Valor inicial null(vazio)

    //Criando a estrutura do formulário
    formCadastroEdicao = new FormGroup({ //formulario
      nome: new FormControl(''), //campo nome
      email: new FormControl(''), // campo email
      telefone: new FormControl('') // campo telefone
    });

    //Criando a estrutura do formulário de cunsulta
    formConsulta = new FormGroup({
      nome : new FormControl('') // campo 'nome' para consulta 
    });

    //Função para realizar o cadastro do cliente
    salvar() {

      //Verificando se nenhum cliente foi selecionado para edição
      if(this.cliente() == null) {
        //Fazendo uma requisição HTTP POST para a API
        this.http.post(this.apiUrl, this.formCadastroEdicao.value, {responseType: 'text'})
          .subscribe((mensagem) => {
              alert(mensagem); //Exibindo a mensagem para o usuário
              this.formCadastroEdicao.reset(); //Limpando o formulário
          });
      } else {
        this.http.put(this.apiUrl + "/" + this.cliente().id, this.formCadastroEdicao.value, 
          {responseType: 'text'})
          .subscribe((mensagem) => {
            alert(mensagem); //Exibindo a mensagem para o usuário
            this.formCadastroEdicao.reset(); //Limpando o formulário
            this.consultar(); //Atualizando a lista de clientes após a edição
            this.cliente.set (null); //Voltar para a opção de cadastro
          });
      }
    }  


    //Função para realizar a consulta dos clientes
    consultar() {
      
      //Fazendo uma requisição HTTP GET para a API
      this.http.get(this.apiUrl + '/' + this.formConsulta.value.nome)
        .subscribe((clientes) => { //Aguardando o retorno da requisição
          this.clientes.set(clientes as any[]); //Exibindo os clientes no console
        });
    }

    //Função para realizar a exclusão de um cliente
    excluir(id: number) {

      //Confirmação para o usuário antes de excluir
      var confirmacao = window.confirm ('Tem certeza que deseja excluir este cliente?');
      if(! confirmacao)
        return; //Cancelar a operação 

      //Fazendo uma requisição HTTP DELETE para a API
      this.http.delete(this.apiUrl + '/' + id, {responseType: 'text'})
        .subscribe((mensagem) => {
          alert(mensagem); //Exibindo a mensagem para o usuário
          this.consultar(); //Atualizando a lista de clientes após a exclusão
        });
    }

    editar(cliente: any) {
      
      //Armazenar os dados do cliente no atributo da classe
      this.cliente.set(cliente);
      //Preenchendo os campos do formulario com os dados do cliente selecionado
      this.formCadastroEdicao.patchValue(cliente);
    }

}
