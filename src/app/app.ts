import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  //Instanciando a biblioteca HTTP CLIENT
  private http = inject(HttpClient);

  //Variavel signal para armazenar o resultado da consulta
  planos = signal<any[]>([]);

  //FUnção reservada do Angular que eh executada qdo o componente eh inicializado
  ngOnInit() {
    //Fazendo uma chamada HTTP GET para a API de consulta de planos
    this.http.get('http://localhost:8081/api/v1/planos')
      .subscribe((consulta) => { //Capturando a resposta d API
        this.planos.set(consulta as any[]); //Armazenar o resultado da consulta na variavel signal
      });

  }

}
