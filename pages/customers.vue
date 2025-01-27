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
      <button type="submit">{{ editingCustomer ? 'Update Customer' : 'Add Customer' }}</button>
    </form>

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
      apiUrl: 'https://wonderful-faloodeh-e3adf5.netlify.app/api/customers', // Full API URL
    };
  },
  async mounted() {
    try {
      const response = await fetch(this.apiUrl);
      if (response.ok) {
        this.customers = await response.json();
      } else {
        console.error('Error fetching customers:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  },
  methods: {
    async handleSubmit() {
      try {
        let response;
        const url = this.editingCustomer
          ? `${this.apiUrl}/${this.editingCustomer._id}`
          : this.apiUrl;
        const method = this.editingCustomer ? 'PUT' : 'POST';

        console.log(`${this.editingCustomer ? 'Updating' : 'Creating'} customer:`, this.newCustomer);

        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newCustomer),
        });

        if (response.ok) {
          const customer = await response.json();
          if (this.editingCustomer) {
            const index = this.customers.findIndex(
              (customer) => customer._id === this.editingCustomer._id
            );
            if (index !== -1) {
              this.customers.splice(index, 1, customer); // Update the customer in the list
            }
          } else {
            this.customers.push(customer); // Add the new customer to the list
          }
          this.resetForm();
        } else {
          const errorText = await response.text();
          console.error(`${this.editingCustomer ? 'Updating' : 'Creating'} customer failed:`, errorText);
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    },
    async deleteCustomer(id) {
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
          this.customers = this.customers.filter((c) => c._id !== id);
        } else {
          console.error('Error deleting customer:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    },
    editCustomer(customer) {
      this.editingCustomer = customer;
      this.newCustomer = { ...customer }; // Pre-fill the form with customer data
    },
    resetForm() {
      this.newCustomer = { fname: '', lname: '', email: '', phone: '' };
      this.editingCustomer = null;
    },
  },
};
</script>
