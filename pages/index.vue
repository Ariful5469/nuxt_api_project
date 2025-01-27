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
    };
  },
  async mounted() {
    try {
      const response = await fetch('/api/customers');
      this.customers = await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  },
  methods: {
    async handleSubmit() {
      if (this.editingCustomer) {
        // Update existing customer
        try {
          console.log('Updating customer data:', this.newCustomer); // Log the data before submitting

          const response = await fetch(`/api/customers/${this.editingCustomer._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newCustomer),
          });

          if (response.ok) {
            const updatedCustomer = await response.json();
            console.log('Updated customer:', updatedCustomer); // Log the updated customer

            const index = this.customers.findIndex(
              (customer) => customer._id === updatedCustomer._id
            );

            if (index !== -1) {
              this.customers.splice(index, 1, updatedCustomer);
              console.log('Customer updated in local data:', updatedCustomer); // Log after updating local state
            }

            this.resetForm();
          } else {
            console.error('Error updating customer:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating customer:', error);
        }
      } else {
        // Add new customer
        try {
          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.newCustomer),
          });

          if (response.ok) {
            const customer = await response.json();
            this.customers.push(customer);
            this.resetForm();
          } else {
            console.error('Error creating customer:', response.statusText);
          }
        } catch (error) {
          console.error('Error creating customer:', error);
        }
      }
    },
    async deleteCustomer(id) {
      try {
        await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        this.customers = this.customers.filter((c) => c._id !== id);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    },
    editCustomer(customer) {
      this.editingCustomer = customer;
      this.newCustomer = { ...customer }; // Pre-fill the form with customer data
      console.log('Editing customer:', this.newCustomer); // Log pre-filled data
    },
    resetForm() {
      this.newCustomer = { fname: '', lname: '', email: '', phone: '' };
      this.editingCustomer = null;
    },
  },
};
</script>
