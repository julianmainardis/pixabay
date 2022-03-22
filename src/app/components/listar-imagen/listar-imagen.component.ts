import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-listar-imagen',
  templateUrl: './listar-imagen.component.html',
  styleUrls: ['./listar-imagen.component.css']
})
export class ListarImagenComponent implements OnInit {
  termino = '';
  suscription: Subscription;
  listImagenes: any[] = [];
  loading = false;
  imagenesPorPagina = 30;
  paginaActual = 1;
  calcularTotalPaginas = 0;

  constructor(private _imagenService: ImagenService) {
    this.suscription = this._imagenService.getTerminoBusqueda().subscribe(data =>{
      this.termino = data;
      this.paginaActual = 1;
      this.loading = true;
      this.obtenerImagenes();
    })
  }

  ngOnInit(): void {
  }

  obtenerImagenes() {
    this._imagenService.getImagenes(this.termino, this.imagenesPorPagina, this.paginaActual).subscribe(data =>{
      this.loading = false;
      
      if(data.hits.length === 0){
        this._imagenService.setError('No se encontro ningun resultado');
        return;
      }
      this.calcularTotalPaginas = Math.ceil(data.totalHits / this.imagenesPorPagina);

      this.listImagenes = data.hits;

    }, error =>{
      this._imagenService.setError('Hubo un error');
      this.loading = false;
    });
  }

  paginaAnterior(){
    this.paginaActual--;
    this.loading = true;
    this.listImagenes = [];
    this.obtenerImagenes();
  }

  paginaPosterior(){
    this.paginaActual++;
    this.loading = true;
    this.listImagenes = [];
    this.obtenerImagenes();
  }

  paginaAnteriorClass(){
    if(this.paginaActual === 1){
      return false;
    } else {
      return true;
    }
  }

  paginaPosteriorClass(){
    if(this.paginaActual === this.calcularTotalPaginas){
      return false;
    } else {
      return true;
    }
  }
}
