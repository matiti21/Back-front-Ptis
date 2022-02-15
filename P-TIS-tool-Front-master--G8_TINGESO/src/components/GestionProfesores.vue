<template>
  <div>

    <br>
    <div class="columns">
      <div class="column is-10"></div>
      <div class="column is-2" v-if="verFormulario"></div>
      <div class="column is-2" v-else>
        <button class="button is-info-usach" @click="agregarProfesor">Agregar Profesor</button>
      </div>
    </div>

    <div v-if="verFormulario">
      <div class="columns">

        <div class="column is-5">
          <form class="form">
            <div class="columns has-text-left">
              <div class="column is-full">
                <div class="field">
                  <label class="label">Nombre:</label>
                  <div class="control">
                    <input v-model="usuario.nombre" class="input" type="text" @input="validarNombre" placeholder="ej.: Ana">
                  </div>
                  <p class="is-danger help" v-if="entradas.nombre.error">{{ entradas.nombre.mensaje }}</p>
                </div>
              </div>
            </div>
            <div class="columns has-text-left">
              <div class="column is-full">
                <div class="field">
                  <label class="label">Apellido Paterno:</label>
                  <div class="control">
                    <input v-model="usuario.apellido_paterno" class="input" type="text" @input="validarApellidoP" placeholder="ej.: Rosas">
                  </div>
                  <p class="is-danger help" v-if="entradas.apellidoPaterno.error">{{ entradas.apellidoPaterno.mensaje }}</p>
                </div>
              </div>
            </div>
            <div class="columns has-text-left">
              <div class="column is-full">
                <div class="field">
                  <label class="label">Apellido Materno</label>
                  <div class="control">
                    <input v-model="usuario.apellido_materno" class="input" type="text" @input="validarApellidoM" placeholder="ej.: Molina">
                  </div>
                  <p class="is-danger help" v-if="entradas.apellidoMaterno.error">{{ entradas.apellidoMaterno.mensaje }}</p>
                </div>
              </div>
            </div>
            <div class="columns has-text-left">
              <div class="column is-full">
                <div class="field">
                  <label class="label">Correo electrónico:</label>
                  <div class="control">
                    <input v-model="usuario.email" class="input" type="text" @input="validarEmail" placeholder="ej.: ana.rosas@gmail.com">
                  </div>
                  <p class="is-danger help" v-if="entradas.correo_elec.error">{{ entradas.correo_elec.mensaje }}</p>
                </div>
              </div>
            </div>
            <br>
            <div class="columns">
              <div class="column is-full">
                <div class="field is-grouped is-grouped-centered">
                  <div class="control">
                    <a class="button is-primary-usach" @click="agregar">{{ actualizarProfesor ? 'Actualizar Profesor' : 'Agregar Profesor' }}</a>
                  </div>
                  <div class="control">
                    <a class="button is-light-usach" @click="noAgregar"><strong>Cancelar</strong></a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="column is-7 has-text-centered">
          <div class="field">
            <label id="secciones" class="label">Secciones a asignar:</label>
          </div>
          <p class="is-danger help" v-if="entradas.secciones">No se ha seleccionado sección a asignar</p>
          <br>
          <div v-if="mostrarLista">
            <table class="table is-bordered is-narrow is-fullwidth" aria-describedby="secciones">
              <thead>
                <tr class="has-background-light">
                  <th scope="col" class="has-text-centered">N°</th>
                  <th scope="col" class="has-text-centered">Código</th>
                  <th scope="col" class="has-text-centered">Curso</th>
                  <th scope="col" class="has-text-centered">Jornada</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(seccion, index) in secciones" :key="seccion.id">
                  <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
                  <td class="has-text-centered">{{ seccion.curso.codigo }}</td>
                  <td class="has-text-left">{{ seccion.curso.nombre }}</td>
                  <td class="has-text-centered">{{ seccion.jornada.nombre }}</td>
                  <td class="has-text-centered"><input type="checkbox" v-model="seccionesAsignadas" :value="seccion.id"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No hay secciones para asignar</p>
          </div>
        </div>

      </div>
      <br>
    </div>

    <div v-if="mostrarProfesores">
      <div class="columns">
        <div class="column is-full">
          <table class="table is-bordered is-narrow is-fullwidth" summary="Profesores">
            <thead>
              <tr class="has-background-light">
                <th scope="col" class="has-text-centered">N°</th>
                <th scope="col" class="has-text-centered">Nombre</th>
                <th scope="col" class="has-text-centered">Correo Electrónico</th>
                <th socpe="col" class="has-text-centered">Jornada</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(profesor, index) in listaProfesores" :key="profesor.id">
                <th scope="row" class="has-text-centered is-vcentered">{{ index + 1 }}</th>
                <td class="is-vcentered"><a @click="editarProfesor(profesor)">{{ nombreCompleto(profesor.usuario) }}</a></td>
                <td class="is-vcentered has-text-centered">{{ profesor.usuario.email }}</td>
                <td>
                  <div v-for="seccion in profesor.secciones" :key="seccion.id">
                    <p class="has-text-centered">{{ seccion.jornada.nombre }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <br>
      <p class="subtitle is-5">No hay profesores en el sistema para mostrar</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'
import { mapState } from 'vuex'

export default {
  name: 'GestionProfesores',
  data () {
    return {
      verFormulario: false,
      usuario: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: ''
      },
      seccionesAsignadas: [],
      listaProfesores: [],
      entradas: {
        nombre: {
          error: false,
          mensaje: ''
        },
        apellidoPaterno: {
          error: false,
          mensaje: ''
        },
        apellidoMaterno: {
          error: false,
          mensaje: ''
        },
        correo_elec: {
          error: false,
          mensaje: ''
        },
        secciones: false
      },
      mensajes: {
        sin_nombre: 'Debe ingresar el nombre del/la profesor/a',
        sin_apellido: 'Debe ingresar el apellido del/la profesor/a',
        sin_correo: 'Debe ingresar el correo electrónico del/la profesor/a',
        sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales',
        correo_mal: 'El correo ingresado no es válido',
        correo_repetido: 'El correo ingresado ya se encuentra en el sistema'
      },
      actualizarProfesor: false,
      idProfesor: 0
    }
  },
  computed: {
    ...mapState(['apiUrl', 'secciones']),

    mostrarLista: function () {
      return this.secciones.length > 0
    },
    mostrarProfesores: function () {
      return this.listaProfesores.length > 0
    }
  },
  methods: {
    nombreCompleto: function (profesor) {
      return Funciones.nombreCompleto(profesor)
    },
    agregarProfesor: function () {
      this.verFormulario = true
      this.nuevoProfesor()
    },
    nuevoProfesor: function () {
      this.usuario.nombre = ''
      this.usuario.apellido_paterno = ''
      this.usuario.apellido_materno = ''
      this.usuario.email = ''
      this.seccionesAsignadas = []
    },
    async obtenerProfesores () {
      try {
        const response = await axios.get(this.apiUrl + '/profesores', { headers: Auth.authHeader() })
        this.listaProfesores = response.data
      } catch {
        console.log('No fue posible obtener la lista de Profesores')
      }
    },
    async agregar () {
      if (this.validarFormulario()) {
        const datos = {
          profesor: {
            usuario_attributes: this.usuario
          },
          secciones: this.seccionesAsignadas
        }
        if (!this.actualizarProfesor) {
          try {
            await axios.post(this.apiUrl + '/profesores', datos, { headers: Auth.postHeader() })
            this.obtenerProfesores()
          } catch (e) {
            console.log('No fue posible crear el profesor')
            console.log(e)
          }
        } else {
          try {
            await axios.put(this.apiUrl + '/profesores/' + this.idProfesor, datos, { headers: Auth.postHeader() })
            this.obtenerProfesores()
          } catch (e) {
            console.log('No fue posible actualizar el profesor')
            console.log(e)
          }
          this.actualizarProfesor = false
          this.idProfesor = 0
        }
        this.verFormulario = false
      }
    },
    noAgregar: function () {
      this.verFormulario = false
      this.entradas.nombre.error = false
      this.entradas.apellidoPaterno.error = false
      this.entradas.apellidoMaterno.error = false
      this.entradas.correo_elec.error = false
      this.entradas.secciones = false
      this.nuevoProfesor()
      this.actualizarProfesor = false
    },
    validarNombre: function () {
      const regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
      const nombre = this.usuario.nombre
      try {
        if (nombre === null || nombre === undefined || nombre === '' || nombre.length === 0) {
          this.entradas.nombre.error = true
          this.entradas.nombre.mensaje = this.mensajes.sin_nombre
          return false
        } else if (!regExp.test(nombre)) {
          this.entradas.nombre.error = true
          this.entradas.nombre.mensaje = this.mensajes.sin_especiales
          return false
        } else {
          this.entradas.nombre.error = false
          this.entradas.nombre.mensaje = ''
          return true
        }
      } catch {
        this.entradas.nombre.error = true
        this.entradas.nombre.mensaje = ''
        return false
      }
    },
    validarApellido: function (apellido, entradas) {
      const regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
      try {
        if (apellido === null || apellido === undefined || apellido === '' || apellido.length === 0) {
          entradas.error = true
          entradas.mensaje = this.mensajes.sin_apellido
          return false
        } else if (!regExp.test(apellido)) {
          entradas.error = true
          entradas.mensaje = this.mensajes.sin_especiales
          return false
        } else {
          entradas.error = false
          entradas.mensaje = ''
          return true
        }
      } catch {
        entradas.error = true
        entradas.mensaje = ''
        return false
      }
    },
    validarApellidoP: function () {
      return this.validarApellido(this.usuario.apellido_paterno, this.entradas.apellidoPaterno)
    },
    validarApellidoM: function () {
      return this.validarApellido(this.usuario.apellido_materno, this.entradas.apellidoMaterno)
    },
    validarEmail: function () {
      const regExp = /^([a-z0-9_.-]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/
      const correo = this.usuario.email
      var separarCorreo = []
      if (correo !== null && correo !== undefined) {
        separarCorreo = correo.split('@')
      }
      try {
        if (correo === null || correo === undefined || correo === '' || correo.length === 0) {
          this.entradas.correo_elec.error = true
          this.entradas.correo_elec.mensaje = this.mensajes.sin_correo
          return false
        } else if (!regExp.test(correo) || separarCorreo.length !== 2) {
          this.entradas.correo_elec.error = true
          this.entradas.correo_elec.mensaje = this.mensajes.correo_mal
          return false
        } else {
          this.entradas.correo_elec.error = false
          this.entradas.correo_elec.mensaje = ''
          return true
        }
      } catch {
        this.entradas.correo_elec.error = true
        this.entradas.correo_elec.mensaje = ''
        return false
      }
    },
    validarSecciones: function () {
      if (this.seccionesAsignadas.length > 0) {
        this.entradas.secciones = false
        return true
      } else {
        this.entradas.secciones = true
        return false
      }
    },
    existeProfesor: function () {
      let existe = false
      let aux = false
      for (var i = 0; i < this.listaProfesores.length; i++) {
        aux = (this.listaProfesores[i].usuario.email === this.usuario.email)
        existe = aux || existe
      }
      if (existe) {
        this.entradas.correo_elec.error = true
        this.entradas.correo_elec.mensaje = this.mensajes.correo_repetido
      }
      return existe
    },
    validarFormulario: function () {
      var esValido = true
      esValido = esValido && this.validarNombre()
      esValido = esValido && this.validarApellidoP()
      esValido = esValido && this.validarApellidoM()
      esValido = esValido && this.validarEmail()
      esValido = esValido && this.validarSecciones()
      if (!this.actualizarProfesor) {
        esValido = esValido && !this.existeProfesor()
      }
      return esValido
    },
    convertirSecciones: function (listaSecciones) {
      var lista = []
      for (var i = 0; i < listaSecciones.length; i++) {
        lista.push(listaSecciones[i].id)
      }
      return lista
    },
    editarProfesor: function (profesor) {
      this.usuario.nombre = profesor.usuario.nombre
      this.usuario.apellido_paterno = profesor.usuario.apellido_paterno
      this.usuario.apellido_materno = profesor.usuario.apellido_materno
      this.usuario.email = profesor.usuario.email
      this.idProfesor = profesor.id
      this.seccionesAsignadas = this.convertirSecciones(profesor.secciones)
      this.actualizarProfesor = true
      this.verFormulario = true
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerProfesores()
    }
  }
}
</script>
