<template>
  <div>
    <h1>Customer Management</h1>

    <!-- Edit Customer Form -->
    <form @submit.prevent="handleSubmit">
      <label>
        First Name:
        <input type="text" v-model="newCustomer.fname" required />
      </label>
      <label>
        Last Name:
        <input type="text" v-model="newCustomer.lname" required />
      </label>
      <label>
        Email:
        <input type="email" v-model="newCustomer.email" required />
      </label>
      <label>
        Phone:
        <input type="tel" v-model="newCustomer.phone" required />
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
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/customers');
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
        if (this.editingCustomer) {
          // Update existing customer
          response = await fetch(`/api/customers/${this.editingCustomer._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newCustomer),
          });

          if (response.ok) {
            const updatedCustomer = await response.json();
            const index = this.customers.findIndex(
              (customer) => customer._id === updatedCustomer._id
            );

            if (index !== -1) {
              this.customers.splice(index, 1, updatedCustomer);
            }

            this.resetForm();
          } else {
            console.error('Error updating customer:', await response.text());
          }
        } else {
          // Add new customer
          response = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newCustomer),
          });

          if (response.ok) {
            const customer = await response.json();
            this.customers.push(customer);
            this.resetForm();
          } else {
            console.error('Error creating customer:', await response.text());
          }
        }
      } catch (error) {
        console.error('Error in handleSubmit:', error);
      }
    },
    async deleteCustomer(id) {
      try {
        const response = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
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
      this.newCustomer = { ...customer }; // Populate the form with the customer data
    },
    resetForm() {
      this.newCustomer = { fname: '', lname: '', email: '', phone: '' };
      this.editingCustomer = null;
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
