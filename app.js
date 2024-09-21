function paginationComponent(){
    return {
      members: [],
      filteredMember: [],
      perpage: 6,
      currentPage: 1,
      searchQuery: '',

      /**
       * Returns the total number of pages in the pagination based on the number of items per page.
       * @returns {Number} The total number of pages.
       */
      get totalpage() {
        return Math.ceil(this.filteredMember.length / this.perpage);
      },
      /**
       * Returns the paginated list of members based on the current page and number of items per page.
       * @returns {Array} The paginated list of members.
       */

      get pageRange() {
      const range = 5; // Jumlah tombol halaman yang ditampilkan
      let start, end;

      if (this.currentPage <= 5) {
        // Halaman awal (1, 2, 3, 4, 5)
        start = 1;
        end = Math.min(this.totalpage, range);
      } else if (this.currentPage > 5 && this.currentPage <= this.totalpage - 1) {
        // Halaman setelah halaman ke-5
        start = this.currentPage - 2;
        end = this.currentPage + 2;

        if (start < 1) {
          start = 1;
          end = Math.min(start + range - 1, this.totalpage);
        }

        if (end > this.totalpage) {
          end = this.totalpage;
          start = Math.max(end - range + 1, 1);
        }
      } else {
        // Halaman terakhir (dari total halaman)
        start = Math.max(1, this.totalpage - range + 1);
        end = this.totalpage;
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },

      get paginatedMember() {
        const start = (this.currentPage - 1) * this.perpage;
        const end = this.currentPage * this.perpage;
        // Return the sliced list of members based on the start and end indices.
        return this.filteredMember.slice(start, end);
      },
      changePage(page) {
        this.currentPage = page;
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalpage) {
          this.currentPage++;
        }
      },

      searchMembers(){
        this.filteredMember = this.members.filter((member) =>{
          const fullName = member.name.toLowerCase();
          return fullName.includes(this.searchQuery.toLowerCase());
        })
      },

      async fetchMembers() {
        const respons = await fetch("https://randomuser.me/api/?results=100");
        const data = await respons.json();
        this.members = data.results.map((member) => ({
          name: `${member.name.first} ${member.name.last}`,
          age: member.dob.age,
          gender: member.gender,
          address: `${member.location.city}, ${member.location.country}`,
          photo: member.picture.large,
        }));
        this.filteredMember = this.members;
      },

      init() {
        this.fetchMembers();
      }
    };
}
