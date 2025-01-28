<template>
  <div>
    <h1>Customer Management</h1>

    <!-- Edit Customer Form -->
    <form @submit.prevent="handleSubmit">
      <label>
        First Name:
        <input
          type="text"
          v-model="newCustomer.fname"
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          v-model="newCustomer.lname"
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          v-model="newCustomer.email"
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          v-model="newCustomer.phone"
          required
        />
      </label>
      <button type="submit" :disabled="loading">
        {{ editingCustomer ? 'Update Customer' : 'Add Customer' }}
      </button>
    </form>

    <!-- Loading Indicator -->
    <p v-if="loading">Loading...</p>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Customer Table -->
    <table v-if="customers.length">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="customer in customers" :key="customer._id">
          <td>{{ customer.fname }}</td>
          <td>{{ customer.lname }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phone }}</td>
          <td>
            <button @click="editCustomer(customer)">Edit</button>
            <button @click="deleteCustomer(customer._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No customers found.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      customers: [],
      newCustomer: { fname: '', lname: '', email: '', phone: '' },
      editingCustomer: null, // Track the customer being edited
      apiUrl: process.env.VUE_APP_API_URL || '/api/customers', // Use environment variable
      loading: false,
      errorMessage: null, // To display error messages
    };
  },
  async mounted() {
    await this.fetchCustomers();
  },
  methods: {
    async fetchCustomers() {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await fetch(this.apiUrl);
        if (response.ok) {
          this.customers = await response.json();
        } else {
          this.errorMessage = 'Error fetching customers.';
        }
      } catch (error) {
        this.errorMessage = 'Error fetching customers.';
        console.error('Fetch error:', error.message);
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      this.loading = true;
      this.errorMessage = null;
      try {
        const url = this.editingCustomer
          ? `${this.apiUrl}/${this.editingCustomer._id}`
          : this.apiUrl;
        const method = this.editingCustomer ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newCustomer),
        });

        if (response.ok) {
          const customer = await response.json();
          if (this.editingCustomer) {
            const index = this.customers.findIndex(
              (c) => c._id === this.editingCustomer._id
            );
            if (index !== -1) {
              this.customers.splice(index, 1, customer);
            }
          } else {
            this.customers.push(customer);
          }
          this.resetForm();
        } else {
          this.errorMessage = 'Error saving customer.';
        }
      } catch (error) {
        this.errorMessage = 'Error saving customer.';
        console.error('Submit error:', error.message);
      } finally {
        this.loading = false;
      }
    },
    async deleteCustomer(id) {
      this.loading = true;
      this.errorMessage = null;
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          this.customers = this.customers.filter((customer) => customer._id !== id);
        } else {
          this.errorMessage = 'Error deleting customer.';
        }
      } catch (error) {
        this.errorMessage = 'Error deleting customer.';
        console.error('Delete error:', error.message);
      } finally {
        this.loading = false;
      }
    },
    editCustomer(customer) {
      this.editingCustomer = customer;
      this.newCustomer = { ...customer };
    },
    resetForm() {
      this.newCustomer = { fname: '', lname: '', email: '', phone: '' };
      this.editingCustomer = null;
    },
  },
};
</script>

<style>
.error {
  color: red;
}
</style>
