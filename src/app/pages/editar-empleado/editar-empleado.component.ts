import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-editar-empleado',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './editar-empleado.component.html',
  styleUrl: './editar-empleado.component.css'
})
export class EditarEmpleadoComponent implements OnInit {
 
  EditarEmpleadoForm: FormGroup = new FormGroup({});
  enviado: boolean = false;
  empleadoDepartamentos: any = [
    'Administracion',
    'Contabilidad',
    'Recursos Humanos',
    'TI',
    'Ventas'
  ];
  empleadoData: Empleado[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private empleadosService: EmpleadoService,
    private actRouter: ActivatedRoute,
  ){
    //this.mainForm();
  }

  ngOnInit(): void {
    this.mainForm();
    const id = this.actRouter.snapshot.paramMap.get('id');
    if (id) {
      this.getEmpleado(id);
      //this.getEmpleado1(id);
    } else {
      console.error('ID de empleado no encontrado en la ruta');
    }
  }

  mainForm(){
    this.EditarEmpleadoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })
  }

  //Metodo que asigna el departamento seleccionado a la pripiedad del formulario
  actualizarDepartamento(event: Event): void {
    const seleccionarElemento = event.target as HTMLSelectElement;
    const departamentoSeleccionado = seleccionarElemento.value;
    this.EditarEmpleadoForm.patchValue({ departamento: departamentoSeleccionado });
  }

  actualizarDepartamento1(event: Event): void {
    const departamentoSeleccionado = (event.target as HTMLSelectElement).value;
    this.EditarEmpleadoForm.patchValue({ departamento: departamentoSeleccionado });
  }

  //getter para acceder a los campos del formulario
  get myForm() {
    return this.EditarEmpleadoForm.controls;
  }

  //Metodo que obtiene el empleado por ID y lo carga en el formulario
  getEmpleado(id: any) {
    this.empleadosService.getEmpleado(id).subscribe({
      next: (data) => {
        this.EditarEmpleadoForm.setValue({
          nombre: data.nombre,
          departamento: data.departamento,
          email: data.email,
          telefono: data.telefono
        });
      },
      error: (error) => {
        console.error('Error al obtener el empleado:', error);
      }
    });
  }

  getEmpleado1(id: any) {
    this.empleadosService.getEmpleado(id).subscribe(
      (data) => {
        this.EditarEmpleadoForm.setValue({
          nombre: data['nombre'],
          departamento: data['departamento'],
          email: data['email'],
          telefono: data['telefono']
        });
      },
    );
  }

  //Metodo que envia el formulario
  onSubmit() {
    this.enviado = true;
    if (!this.EditarEmpleadoForm.valid) {
      console.log('Formulario no válido');
      return false;
    } else {
      if(window.confirm('¿Estas seguro que deseas actualizar este empleado?')) {
        const id = this.actRouter.snapshot.paramMap.get('id');
        return this.empleadosService.actualizarEmpleado(id, this.EditarEmpleadoForm.value).subscribe({
          complete: () => {
            console.log('Empleado actualizado correctamente');
            this.router.navigateByUrl('/listar-empleados');
          },
          error: (error) => {
            console.error('Error al actualizar empleado:', error);
          }
        });
      } else{ return false; }
    }
  }
}
