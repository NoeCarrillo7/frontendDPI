import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { EmpleadoService } from '../../services/empleado.service';


@Component({
  selector: 'app-agregar-empleado',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './agregar-empleado.component.html',
  styleUrl: './agregar-empleado.component.css'
})
export class AgregarEmpleadoComponent implements OnInit {
  
  empleadoForm: FormGroup = new FormGroup({});
  enviado: boolean = false;
  empleadoDepartamentos: any = [
    'Administracion',
    'Contabilidad',
    'Recursos Humanos',
    'TI',
    'Ventas'
  ];

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private empleadosService: EmpleadoService
  ){ this.mainForm();}

  ngOnInit(): void {}

  mainForm(){
    this.empleadoForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    })
  }

  //Metodo que asigna el departamento seleccionado a la pripiedad del formulario
  actualizarDepartamento(event: Event): void {
    const departamentoSeleccionado = (event.target as HTMLSelectElement).value;
    this.empleadoForm.patchValue({ departamento: departamentoSeleccionado });
  }

  //getter para acceder a los campos del formulario
  get myForm() {
    return this.empleadoForm.controls;
  }

  //Metodo que envia el formulario
  onSubmit() {
    this.enviado = true;
    if (!this.empleadoForm.valid) {
      console.log('Formulario no válido');
      return false;
    } else {
      return this.empleadosService.agregarEmpleado(this.empleadoForm.value).subscribe({
        complete: () => {
          console.log('Empleado agregado correctamente');
          this.ngZone.run(() => this.router.navigateByUrl('/listar-empleados'));
        },
        error: (error) => {
          console.error('Error al agregar empleado:', error);
        }
      });
    }
  }

}
