/* Formatando moedas */

import { currencyFormatter } from '@/utils'

export default {
  methods: {
    formatCurrency (value) {
      return currencyFormatter().format(value)
    }
  }
}
