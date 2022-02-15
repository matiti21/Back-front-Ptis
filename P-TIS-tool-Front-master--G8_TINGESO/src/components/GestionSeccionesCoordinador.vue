<template>
  <div>

    <br>
    <div class="columns">
      <div class="column is-10"></div>
      <div class="column is-2" v-if="verFormulario"></div>
      <div class="column is-2" v-else>
        <button class="button is-info-usach" @click="agregarSeccion">Agregar Sección</button>
      </div>
    </div>

    <div v-if="verFormulario">
      <form class="form">
        <div class="columns has-text-left">
          <div class="column is-2 is-offset-one-fifth">
            <div class="field">
              <label class="label">Código:</label>
              <div class="control">
                <input v-model="seccion.codigo" class="input" type="text">
              </div>
              <p class="is-danger help" v-if="entradas.codigo.error">{{ entradas.codigo.mensaje }}</p>
            </div>
          </div>
          <div class="column is-2">
            <div class="field">
              <label class="label">Jornada:</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="seccion.jornada_id" :class="{ 'is-danger' : entradas.jornada_id.error}">
                    <option v-for="jornada in listaJornadas" :key="jornada.id" :value="jornada.id">
                      {{ jornada.nombre }}
                    </option>
                  </select>
                </div>
              </div>
              <p class="is-danger help" v-if="entradas.jornada_id.error">{{ entradas.jornada_id.mensaje }}</p>
            </div>
          </div>
          <div class="column is-4">
            <div class="field">
              <label class="label">Curso:</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select v-model="seccion.curso_id" :class="{ 'is-danger' : entradas.curso_id.error}">
                    <option v-for="curso in listaCursos" :key="curso.id" :value="curso.id">
                      {{ curso.nombre }} - {{curso.codigo}}
                    </option>
                  </select>
                </div>
              </div>
              <p class="is-danger help" v-if="entradas.curso_id.error">{{ entradas.curso_id.mensaje }}</p>
            </div>
          </div>
        </div>
        <br>
        <div class="columns">
          <div class="column is-full">
            <div class="field is-grouped is-grouped-centered">
              <div class="control">
                <a class="button is-primary-usach" @click="agregar">Agregar</a>
              </div>
              <div class="control">
                <a class="button is-light-usach" @click="noAgregar"><strong>Cancelar</strong></a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <br>

    <div v-if="verSecciones">
      <div class="columns">
        <div class="column is-full">
          <table class="table is-bordered is-narrow is-fullwidth" summary="Profesores">
            <thead>
              <tr class="has-background-light">
                <th scope="col" class="has-text-centered">N°</th>
                <th scope="col" class="has-text-centered">Código</th>
                <th scope="col" class="has-text-centered">Curso</th>
                <th socpe="col" class="has-text-centered">Jornada</th>
                <th socpe="col" class="has-text-centered">Semestre</th>
                <th scope="col" class="has-text-centered"><input type="checkbox" @click="seleccionarTodos"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(seccion, index) in listaSecciones" :key="seccion.id">
                <th scope="row" class="has-text-centered is-vcentered">{{ index + 1 }}</th>
                <td class="is-vcentered">{{ seccion.codigo }}</td>
                <td class="is-vcentered">{{ seccion.curso.nombre }}</td>
                <td class="is-vcentered">{{ seccion.jornada.nombre }}</td>
                <td class="is-vcentered has-text-centered">{{ seccion.semestre.identificador}}</td>
                <td class="has-text-centered"><input type="checkbox" v-model="eliminados" :value="seccion.id"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else>
      <br>
      <p class="subtitle is-5">No hay secciones en el sistema para mostrar</p>
    </div>

    <div v-if="mostrarEliminar">
        <br>
        <div class="columns">
          <div class="column is-half is-offset-3">
            <div class="field">
              <div class="control">
                <button class="button is-secondary-usach is-fullwidth" @click="eliminarSecciones">Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal" :class="{ 'is-active ' : notificar }">
          <div class="modal-background"></div>
          <div class="modal-content">

            <div class="box">
              <div class="columns">
                <div class="column is-full">
                  <p class="title is-5">¿Confirma la eliminación de {{ numeroSecciones }} secciones?</p>
                  <div class="columns is-centered">
                    <div class="column is-3">
                      <div class="field is-grouped is-grouped-centered">
                        <div class="control">
                          <a class="button is-info-usach is-rounded" @click="confirmarEliminacion">Aceptar</a>
                        </div>
                      </div>
                    </div>
                    <div class="column is-1"></div>
                    <div class="column is-3">
                      <div class="field is-grouped is-grouped-centered">
                        <div class="control">
                          <a class="button is-light-usach is-rounded" @click="cancelarEliminacion">Cancelar</a>
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

  </div>
</template>

<script>
import axios from 'axios'
import Auth from '@/services/auth.js'
import { mapState } from 'vuex'

export default {
  name: 'GestionSecciones',
  data () {
    return {
      listaSecciones: [],
      eliminados: [],
      notificar: false,
      verFormulario: false,
      semestreActual: '',
      listaJornadas: [],
      listaCursos: [],
      seccion: {
        codigo: '',
        jornada_id: 0,
        semestre_id: 0,
        curso_id: 0,
        borrado: false
      },
      entradas: {
        codigo: {
          error: false,
          mensaje: ''
        },
        jornada_id: {
          error: false,
          mensaje: ''
        },
        semestre_id: {
          error: false,
          mensaje: ''
        },
        curso_id: {
          error: false,
          mensaje: ''
        }
      },
      mensajes: {
        sin_codigo: 'Debe ingresar codigo de la sección',
        sin_jornada: 'Debe ingresar jornada de la sección',
        sin_semestre: 'Debe ingresar semestre de la sección',
        sin_curso: 'Debe ingresar curso de la sección',
        sin_especiales: 'Sólo letras. Verificar que no tenga caracteres especiales'
      }
    }
  },
  computed: {
    ...mapState(['apiUrl']),

    verSecciones: function () {
      return this.listaSecciones.length > 0
    },
    mostrarEliminar: function () {
      return this.eliminados.length > 0
    },
    numeroSecciones: function () {
      return this.eliminados.length
    }
  },
  methods: {
    async obtenerSecciones () {
      try {
        const Secciones = await axios.get(this.apiUrl + '/secciones', { headers: Auth.authHeader() })
        this.listaSecciones = Secciones.data
      } catch (error) {
        console.log(error)
      }
    },
    async CargarSemestre () {
      try {
        const Semestre = await axios.get(this.apiUrl + '/semestres', { headers: Auth.authHeader() })
        this.semestreActual = Semestre.data
        this.seccion.semestre_id = Semestre.data.id
        this.ver = true
      } catch (error) {
        console.log(error)
      }
    },
    async CargarJornadas () {
      try {
        const Jornadas = await axios.get(this.apiUrl + '/jornadas', { headers: Auth.authHeader() })
        this.listaJornadas = Jornadas.data
      } catch (error) {
        console.log(error)
      }
    },
    async CargarCursos () {
      try {
        const Cursos = await axios.get(this.apiUrl + '/cursos', { headers: Auth.authHeader() })
        this.listaCursos = Cursos.data
      } catch (error) {
        console.log(error)
      }
    },
    async agregar () {
      if (this.validarFormulario()) {
        const seccion = {
          codigo: this.seccion.codigo,
          jornada_id: this.seccion.jornada_id,
          semestre_id: this.seccion.semestre_id,
          curso_id: this.seccion.curso_id
        }
        try {
          await axios.post(this.apiUrl + '/secciones', seccion, { headers: Auth.postHeader() })
          this.obtenerSecciones()
        } catch (e) {
          console.log(e)
        }
        this.verFormulario = false
      }
    },
    validarJornada: function () {
      const seleccion = this.seccion.jornada_id
      if (seleccion === null || seleccion === undefined || seleccion === '' || seleccion === 0) {
        return false
      } else {
        return true
      }
    },
    validarCurso: function () {
      const seleccion = this.seccion.curso_id
      if (seleccion === null || seleccion === undefined || seleccion === '' || seleccion === 0) {
        return false
      } else {
        return true
      }
    },
    validarSemestre: function () {
      const seleccion = this.seccion.semestre_id
      if (seleccion === null || seleccion === undefined || seleccion === '' || seleccion === 0) {
        return false
      } else {
        return true
      }
    },
    validarFormulario: function () {
      var esvalido = true
      esvalido = esvalido && this.validarJornada()
      esvalido = esvalido && this.validarCurso()
      esvalido = esvalido && this.validarSemestre()
      return esvalido
    },
    agregarSeccion: function () {
      this.verFormulario = true
      this.nuevaSeccion()
    },
    nuevaSeccion: function () {
      this.seccion.codigo = ''
      this.seccion.jornada_id = 0
      this.seccion.curso_id = 0
      this.seccion.borrado = false
    },
    validarCodigo: function () {
      const regExp = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g
      const codigo = this.seccion.codigo
      try {
        if (codigo === null || codigo === undefined || codigo === '' || codigo.length === 0) {
          this.entradas.codigo.error = true
          this.entradas.codigo.mensaje = this.mensajes.sin_codigo
          return false
        } else if (!regExp.test(codigo)) {
          this.entradas.codigo.error = true
          this.entradas.codigo.mensaje = this.mensajes.sin_especiales
          return false
        } else {
          this.entradas.codigo.error = false
          this.entradas.codigo.mensaje = ''
          return true
        }
      } catch {
        this.entradas.codigo.error = true
        this.entradas.codigo.mensaje = ''
        return false
      }
    },
    noAgregar: function () {
      this.verFormulario = false
      this.entradas.codigo.error = false
      this.entradas.semestre_id.error = false
      this.entradas.jornada_id.error = false
      this.entradas.curso_id.error = false
      this.nuevaSeccion()
    },
    seleccionarTodos: function () {
      if (this.eliminados.length === this.listaSecciones.length) {
        this.eliminados = []
      } else {
        this.eliminados = []
        for (var i = 0; i < this.listaSecciones.length; i++) {
          this.eliminados.push(this.listaSecciones[i].id)
        }
      }
    },
    eliminarSecciones: function () {
      this.notificar = true
    },
    cancelarEliminacion: function () {
      this.notificar = false
    },
    async confirmarEliminacion () {
      const seccion = { eliminados: this.eliminados }
      try {
        await axios.post(this.apiUrl + '/secciones/eliminar', seccion, { headers: Auth.postHeader() })
        this.notificar = false
        this.obtenerSecciones()
        this.eliminados = []
      } catch (e) {
        this.notificar = false
        console.log('No fue posible eliminar los estudiantes seleccioandos')
        console.log(e)
      }
    }
  },
  created () {
    if (localStorage.user_tk) {
      this.obtenerSecciones()
      this.CargarSemestre()
      this.CargarJornadas()
      this.CargarCursos()
    }
  }
}
</script>
