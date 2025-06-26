import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  baseUri: string = 'https://backenddwp.onrender.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // Método para agregar un empleado
  agregarEmpleado(data: any): Observable<any> {
    let url = `${this.baseUri}/agregar`;
    return this.http.post(url, data)
      .pipe(catchError(this.errorManager));
  }

  // Método para obtener todos los empleados
  getEmpleados(): Observable<any> {
    let url = `${this.baseUri}/empleados`;
    return this.http.get(url);
  }

  // Método para obtener un empleado por ID
  getEmpleado(id: any): Observable<any> {
    let url = `${this.baseUri}/empleado/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.errorManager)
    );
  }

  // Método para actualizar un empleado
  actualizarEmpleado(id: any, data: any): Observable<any> { 
    let url = `${this.baseUri}/actualizar/${id}`;
    return this.http.put(url, data, { headers: this.headers })
      .pipe(catchError(this.errorManager));
  }

  // Método para eliminar un empleado
  eliminarEmpleado(id: any): Observable<any> {
    let url = `${this.baseUri}/eliminar/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .pipe(catchError(this.errorManager));
  }

  // Método para manejar errores
  errorManager(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status} \n Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => {return errorMessage});
  }
}
