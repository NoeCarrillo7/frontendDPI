import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-empleados',
  imports: [RouterLink],
  templateUrl: './listar-empleados.component.html',
  styleUrl: './listar-empleados.component.css'
})
export class ListarEmpleadosComponent implements OnInit {
  listaEmpleados: any[] = [];

  constructor(private empleadoService: EmpleadoService) {
    this.getEmpleados();
  }

  ngOnInit(): void { }

  getEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe(
      (data) => {
        this.listaEmpleados = data;
        console.log('Empleados obtenidos:', this.listaEmpleados);
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  eliminarEmpleado(id: any): void {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id).subscribe(
        () => {
          console.log('Empleado eliminado con éxito');
          this.getEmpleados();
        },
        (error) => {
          console.error('Error al eliminar el empleado:', error);
        }
      );
    }
  }

  eliminarEmpledo2(empleado: any, index: any){
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(empleado._id).subscribe(
        (data) => {
          console.log('Empleado eliminado con éxito');
          this.listaEmpleados.splice(index, 1); // Actualizar la lista después de eliminar
        },
        (error) => {
          console.error('Error al eliminar el empleado:', error);
        }
      );
    }
  }

}
