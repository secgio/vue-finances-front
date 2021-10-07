<!--  Montando tela de login do usuario -->
<template>
  <v-container fill-height>
    <v-layout
      justify-center
      align-center
    >
      <!-- alinhamentos centralizados -->

      <v-flex
        xs12
        sm6
        md4
        lg3
        xl3
      >
        <!-- breakpoints -->
        <v-card class="elevation-12">

          <v-toolbar
            color="primary"
            dark
          >
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular
              v-show="isLoading"
              indeterminate
              color="white"
              width="2"
            ></v-progress-circular>
          </v-toolbar>

          <v-card-text>
            <v-form>
              <v-text-field
                v-if="!isLogin"
                prepend-icon="person"
                name="name"
                label="Nome"
                type="text"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid"
                v-model.trim="$v.user.name.$model"
              ></v-text-field>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="Email"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid"
                v-model.trim="$v.user.email.$model"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Senha"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid"
                v-model.trim="$v.user.password.$model"
              ></v-text-field>
            </v-form>
            <v-btn
              block
              depressed
              color="secondary"
              @click="isLogin = !isLogin"
            >
              {{ texts.button }}
            </v-btn>
          </v-card-text>

          <v-card-actions>
            <!-- :disabled="$v.$invalid" botão de login vai ficar inativo até ter um usuario valido  -->
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              large
              @click="submit"
            >
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>

          <v-snackbar
            v-model="showSnackbar"
            top
          >
            {{ error }}
            <v-btn
              color="pink"
              text
              icon
              @click="showSnackbar = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-snackbar>

        </v-card>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

import { required, email, minLength } from 'vuelidate/lib/validators'
import AuthService from './../services/auth-service'
import { formatError } from '@/utils'

export default {
  name: 'login',
  data: () => ({
    error: undefined,
    isLogin: true,
    isLoading: false,
    showSnackbar: false,
    user: {
      name: '',
      email: '',
      password: ''
    }
  }),
  validations () {
    const validations = {
      user: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(6)
        }
      }
    }
    if (this.isLogin) { return validations }

    return {
      user: {
        ...validations.user,
        name: {
          required,
          minLength: minLength(3)
        }
      }
    }
  },
  computed: {
    texts () {
      return this.isLogin
        ? { toolbar: 'Entrar', button: 'Criar Conta' }
        : { toolbar: 'Criar Conta', button: 'Já possuo uma conta' }
    },
    nameErrors () { /* adicionando erro quando o nome não for digitado ($dirty) e se for digitado verefica se está correto */
      const errors = []
      const name = this.$v.user.name
      if (!name.$dirty) { return errors }
      !name.required && errors.push('Nome é obrigatório')
      !name.minLength && errors.push(`Insira pelo menos ${name.$params.minLength.min} caracteres`)
      return errors
    },
    emailErrors () { /* adicionando erro quando o email não for digitado ($dirty) e se for digitado verefica se está correto */
      const errors = []
      const email = this.$v.user.email
      if (!email.$dirty) { return errors }
      !email.required && errors.push('Email é obrigatório')
      !email.email && errors.push('Insira um email válido')
      return errors
    },
    passwordErrors () { /* adicionando erro quando a senha não for digitado ($dirty) e se for digitado verefica se está correto */
      const errors = []
      const password = this.$v.user.password
      if (!password.$dirty) { return errors }
      !password.required && errors.push('Senha é obrigatório')
      !password.minLength && errors.push(`Insira pelo menos ${password.$params.minLength.min} caracteres`)
      return errors
    }
  },
  methods: {
    async submit () {
      this.isLoading = true
      try {
        this.isLogin
          ? await AuthService.login(this.user)
          : await AuthService.signup(this.user)
        this.$router.push(this.$route.query.required || '/dashboard').catch(() => { })
      } catch (error) {
        console.log(error)
        this.error = formatError(error.message)
        this.showSnackbar = true
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
