<template>
  <div>
    <br />
    <!-- Botones -->
    <div class="columns">
      <div class="column is-8"></div>
      <div class="column is-4">
        <div class="field is-grouped is-grouped-right">
          <p class="control">
            <a class="button is-light-usach">Ayuda</a>
          </p>
          <p class="control" v-if="verFormulario">
            <a class="button is-info-usach" @click="obtenerEstudiantesJornada()"
              >Asignar estudiante</a
            >
          </p>
        </div>
      </div>
    </div>
    <br />
    <!-- Mostrar Formulario -->
    <div v-if="verFormulario">
      <form class="form" method="post">
        <div class="columns has-text-left">
          <div class="column is-6">
            <div class="field">
              <label class="label">Jornada:</label>
              <div class="control">
                <input
                  v-model="seccion.jornada.nombre"
                  class="input"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label">Código:</label>
              <div class="control">
                <input
                  v-model="seccion.codigo"
                  class="input"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns has-text-left">
          <div class="column is-6">
            <div class="field">
              <label class="label">Semestre:</label>
              <div class="control">
                <input
                  v-model="seccion.semestre.numero"
                  class="input"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label">Curso:</label>
              <div class="control">
                <input
                  v-model="seccion.curso.nombre"
                  class="input"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns has-text-left">
          <div class="column is-6">
            <div class="field">
              <label class="label">Año:</label>
              <div class="control">
                <input
                  v-model="seccion.semestre.agno"
                  class="input"
                  type="text"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-12">
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <a
                  class="button is-primary-usach"
                  @click="actualizarEstudiantes"
                  >Actualizar</a
                >
              </div>
              <div class="control">
                <a class="button is-light-usach" @click="cerrarFormularios()"
                  >Cancelar</a
                >
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Notificacion de asignación exitosa -->
    <div class="notification is-info is-light" v-if="asignacionExitosa">
      <button class="delete" @click="visualizarAsignacionExitosa()"></button>
      Los estudiantes han sido asignados de manera exitosa.
    </div>
    <!--Mostrar Lista Estudiantes de Seccion-->
    <div v-if="mostrarListaEstudiantesSeccion">
      <div class="has-text-left">
        <label class="label">Estudiantes de la sección:
          <span
          id="icono-ayuda"
          ayuda="Estudiantes que pertenecen a la sección"
          class="icon is-large"
        >
          <i class="far fa-question-circle"></i>
        </span>
        </label>
      </div>
      <table
        class="table is-bordered is-narrow is-fullwidth"
        summary="Estudiantes"
      >
        <thead>
          <tr class="has-background-light">
            <th scope="col" class="has-text-centered">N°</th>
            <th scope="col" class="has-text-centered">R.U.N</th>
            <th scope="col" class="has-text-centered">Nombre estudiante</th>
            <th scope="col" class="has-text-centered">Correo electrónico</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(estudiante, index) in listaEstudiantesSeccion"
            :key="estudiante.id"
          >
            <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
            <td class="has-text-centered">
              {{ visualizarRun(estudiante.run_est) }}
            </td>
            <td class="has-text-centered">{{ nombreCompleto(estudiante) }}</td>
            <td class="has-text-centered">{{ estudiante.correo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Mostrar Lista de Estudiantes Jornada -->
    <br />
    <div v-if="mostrarListaEstudiantesJornada">
      <div class="has-text-left">
        <label class="label">Estudiantes a asignar:
          <span
          id="icono-ayuda"
          ayuda="Estudiantes que no pertenecen a la sección, pero pertenecen a la misma jornada y semestre"
          class="icon is-large"
        >
          <i class="far fa-question-circle"></i>
        </span>
        </label>
      </div>
      <table
        class="table is-bordered is-narrow is-fullwidth"
        summary="Estudiantes"
      >
        <thead>
          <tr class="has-background-light">
            <th scope="col" class="has-text-centered">N°</th>
            <th scope="col" class="has-text-centered">R.U.N</th>
            <th scope="col" class="has-text-centered">Nombre estudiante</th>
            <th scope="col" class="has-text-centered">Correo electrónico</th>
            <th scope="col" class="has-text-centered">Asignar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(estudiante, index) in listaEstudiantesJornadaOtraSeccion"
            :key="estudiante.id"
          >
            <th scope="row" class="has-text-centered">{{ index + 1 }}</th>
            <td class="has-text-centered">
              {{ visualizarRun(estudiante.run_est) }}
            </td>
            <td class="has-text-centered">{{ nombreCompleto(estudiante) }}</td>
            <td class="has-text-centered">{{ estudiante.correo }}</td>
            <td class="has-text-centered">
              <input
                type="checkbox"
                v-model="estudiantesActualizar"
                :value="estudiante.id"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="modal" :class="{ 'is-active': notificar }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <div class="columns">
              <div class="column is-full">
                <p class="title is-5">
                  ¿Confirma el cambio de sección de los estudiantes
                  seleccionados?
                </p>
                <div class="columns is-centered">
                  <div class="column is-3">
                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <a
                          class="button is-info-usach is-rounded"
                          @click="confirmarActualizacionSeccion()"
                          >Aceptar</a
                        >
                      </div>
                    </div>
                  </div>
                  <div class="column is-1"></div>
                  <div class="column is-3">
                    <div class="field is-grouped is-grouped-centered">
                      <div class="control">
                        <a
                          class="button is-light-usach is-rounded"
                          @click="cancelarActualizarEstudiantes()"
                          >Cancelar</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Mostrar Secciones -->
    <hr />
    <div v-if="mostrarLista">
      <table
        class="table is-bordered is-narrow is-fullwidth"
        summary="Secciones"
      >
        <thead>
          <tr class="has-background-light">
            <th scope="col" class="has-text-centered">N°</th>
            <th scope="col" class="has-text-centered">Jornada</th>
            <th scope="col" class="has-text-centered">Código</th>
            <th scope="col" class="has-text-centered">Semestre</th>
            <th scope="col" class="has-text-centered">Curso</th>
            <th scope="col" class="has-text-centered"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(seccion, index) in listaSecciones" :key="seccion.id">
            <th scope="row" class="is-vcentered has-text-centered">
              {{ index + 1 }}
            </th>
            <td class="is-vcentered has-text-centered">
              {{ seccion.jornada.nombre }}
            </td>
            <td class="is-vcentered has-text-centered">{{ seccion.codigo }}</td>
            <td class="is-vcentered has-text-centered">
              {{ seccion.semestre.numero }}/{{ seccion.semestre.agno }}
            </td>
            <td class="is-vcentered has-text-centered">
              {{ seccion.curso.nombre }}
            </td>
            <td class="has-text-centered">
              <a class="button is-primary-usach" @click="cargarSeccion(seccion)"
                >Editar</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Auth from '@/services/auth.js'
import Funciones from '@/services/funciones.js'

import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'GestionSecciones',
  data () {
    return {
      help: false,
      verFormulario: false,
      seccion: {
        id: 0,
        codigo: '',
        jornada: {
          nombre: ''
        },
        semestre: {
          numero: null,
          agno: null
        },
        curso: {
          nombre: ''
        }
      },
      estudiante: {
        id: 0,
        usuario: {
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          run: '',
          email: ''
        },
        seccion_id: null
      },
      listaSecciones: [],
      listaEstudiantesSeccion: [],
      listaEstudiantesId: [],
      listaEstudiantesJornada: [],
      listaEstudiantesJornadaId: [],
      listaEstudiantesJornadaOtraSeccion: [],
      listaEstudiantesSeccionActualizada: [],
      estudiantesActualizar: [],
      mostrarLista: false,
      mostrarListaEstudiantesSeccion: false,
      mostrarListaEstudiantesJornada: false,
      mostrarMensajeListaVacia: false,
      asignacionExitosa: false,
      mensajeListaVacia: 'No se encuentran estudiantes',
      notificar: false,
      faqs_open: []
    }
  },
  computed: {
    ...mapState(['apiUrl', 'secciones', 'faqsProfesor'])
  },
  methods: {
    async obtenerSecciones () {
      try {
        const secciones = await axios.get(
          this.apiUrl + 'profesor/secciones/mostrar_secciones',
          { headers: Auth.authHeader() }
        )
        this.listaSecciones = secciones.data
        if (Object.keys(this.listaSecciones).length > 0) {
          this.mostrarLista = true
        } else {
          this.mostrarLista = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerAyuda () {
      try {
        const response = await axios.get(
          this.apiUrl + '/faqs/profesor/estudiante',
          { headers: Auth.authHeader() }
        )
        this.$store.commit('setFaqsProfesor', response.data)
      } catch {
        console.log('No fue posible obtener las faqs')
      }
    },
    async cargarSeccion (seccion) {
      this.seccion.id = seccion.id
      this.seccion.codigo = seccion.codigo
      this.seccion.semestre.numero = seccion.semestre.numero
      this.seccion.semestre.agno = seccion.semestre.agno
      this.seccion.jornada.nombre = seccion.jornada.nombre
      this.seccion.curso.nombre = seccion.curso.nombre
      this.verFormulario = true
      this.obtenerEstudiantesSeccion(seccion)
    },
    async obtenerEstudiantesSeccion (seccion) {
      try {
        const estudiantes = await axios.get(
          this.apiUrl + 'profesor/secciones/mostrar_secciones/' + seccion.id,
          { headers: Auth.authHeader() }
        )
        this.listaEstudiantesSeccion = estudiantes.data
        this.cerrarListasEstudiantes()
        if (Object.keys(this.listaEstudiantesSeccion).length > 0) {
          this.listaEstudiantesId = this.convertirEstudiantes(
            this.listaEstudiantesSeccion
          )
          this.visualizarEstudiantesSeccion()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerEstudiantesJornada () {
      try {
        const estudiantes = await axios.get(
          this.apiUrl +
            'profesor/secciones/estudiantes_jornada/' +
            this.seccion.jornada.nombre,
          { headers: Auth.authHeader() }
        )
        this.listaEstudiantesJornada = estudiantes.data
        this.cerrarListasEstudiantes()
        if (this.listaEstudiantesJornada.length > 0) {
          this.listaEstudiantesJornadaId = this.convertirEstudiantes(
            this.listaEstudiantesJornada
          )
          this.crearListaEstudiantesJornadasOtraSeccion(this.seccion.id)
          this.visualizarEstudiantesJornada()
        }
      } catch (error) {
        console.log(error)
      }
    },
    async confirmarActualizacionSeccion () {
      this.notificar = false
      this.crearListaActualizados()
      if (this.listaEstudiantesSeccionActualizada.length > 0) {
        for (
          var i = 0;
          i < this.listaEstudiantesSeccionActualizada.length;
          i++
        ) {
          this.cargarEstudiante(this.listaEstudiantesSeccionActualizada[i])
          const nuevoEstudiante = {
            estudiante: {
              usuario_attributes: this.estudiante.usuario,
              seccion_id: this.seccion.id
            }
          }
          try {
            await axios.patch(
              this.apiUrl +
                '/estudiantes/' +
                this.listaEstudiantesSeccionActualizada[i].id,
              nuevoEstudiante,
              { headers: Auth.postHeader() }
            )
            this.obtenerEstudiantesJornada()
            this.$forceUpdate()
          } catch (error) {
            console.log(error)
          }
          this.visualizarAsignacionExitosa()
        }
      } else {
        console.log('No hay estudiantes que asignar a la sección')
      }
      this.cerrarFormularios()
    },
    actualizarEstudiantes: function () {
      this.notificar = true
    },
    cancelarActualizarEstudiantes: function () {
      this.notificar = false
    },
    nombreCompleto: function (estudiante) {
      return (
        estudiante.nombre_est +
        ' ' +
        estudiante.apellido1 +
        ' ' +
        estudiante.apellido2
      )
    },
    visualizarRun: function (run) {
      return Funciones.visualizarRun(run)
    },
    crearListaActualizados: function () {
      var aux = []
      for (var i = 0; i < this.estudiantesActualizar.length; i++) {
        var indice = Funciones.buscarIndexPorId(
          this.listaEstudiantesJornada,
          this.estudiantesActualizar[i]
        )
        if (indice !== -1) {
          aux.push(this.listaEstudiantesJornada[indice])
        }
      }
      this.listaEstudiantesSeccionActualizada = aux
    },
    crearListaEstudiantesJornadasOtraSeccion: function (seccionId) {
      var aux = []
      for (var i = 0; i < this.listaEstudiantesJornada.length; i++) {
        if (this.listaEstudiantesJornada[i].seccion_id !== seccionId) {
          aux.push(this.listaEstudiantesJornada[i])
        }
      }
      this.listaEstudiantesJornadaOtraSeccion = aux
    },
    visualizarFormulario: function () {
      if (this.verFormulario === true) {
        this.verFormulario = false
      } else {
        this.verFormulario = true
      }
    },
    visualizarEstudiantesSeccion: function () {
      if (this.mostrarListaEstudiantesSeccion === true) {
        this.mostrarListaEstudiantesSeccion = false
      } else {
        this.mostrarListaEstudiantesSeccion = true
      }
    },
    visualizarEstudiantesJornada: function () {
      if (this.mostrarListaEstudiantesJornada === true) {
        this.mostrarListaEstudiantesJornada = false
      } else {
        this.mostrarListaEstudiantesJornada = true
      }
    },
    visualizarAsignacionExitosa: function () {
      if (this.asignacionExitosa === true) {
        this.asignacionExitosa = false
      } else {
        this.asignacionExitosa = true
      }
    },
    cerrarFormularios: function () {
      this.verFormulario = false
      this.cerrarListasEstudiantes()
    },
    cerrarListasEstudiantes: function () {
      this.mostrarListaEstudiantesSeccion = false
      this.mostrarListaEstudiantesJornada = false
    },
    convertirEstudiantes: function (listaEstudiantes) {
      var lista = []
      for (var i = 0; i < listaEstudiantes.length; i++) {
        lista.push(listaEstudiantes[i].id)
      }
      return lista
    },
    cargarEstudiante: function (estudiante) {
      this.estudiante.id = estudiante.id
      this.estudiante.usuario.nombre = estudiante.nombre_est
      this.estudiante.usuario.apellido_paterno = estudiante.apellido1
      this.estudiante.usuario.apellido_materno = estudiante.apellido2
      this.estudiante.usuario.run = estudiante.run_est
      this.estudiante.usuario.email = estudiante.correo
      this.estudiante.seccion_id = estudiante.seccion_id
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerSecciones()
      this.obtenerAyuda()
    }
  }
}
</script>
