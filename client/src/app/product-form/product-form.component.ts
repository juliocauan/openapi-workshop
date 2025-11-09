import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { NewProduct, Product } from '../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  products: Product[] = [];
  newProduct: NewProduct = { nome: '', preco: 0 };
  selectedProduct: Product | null = null;
  message: string | null = null;
  messageClass: string = '';
  loading: boolean = false;
  loadingList: boolean = false;
  isEditing: boolean = false;
  editingId: number | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loadingList = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loadingList = false;
        console.log('Produtos carregados:', products);
      },
      error: (err) => {
        this.loadingList = false;
        this.showMessage(`Erro ao carregar produtos: ${err.status}`, 'error');
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.message = null;

    if (this.isEditing && this.editingId) {
      // Atualizar produto existente
      this.productService.updateProduct(this.editingId, this.newProduct).subscribe({
        next: (product) => {
          this.showMessage(`Produto "${product.nome}" atualizado com sucesso!`, 'success');
          this.loadProducts();
          this.cancelEdit();
          this.loading = false;
          console.log('Produto atualizado:', product);
        },
        error: (err) => {
          this.showMessage(`Erro ao atualizar: ${err.status} - ${err.statusText}`, 'error');
          this.loading = false;
          console.error('Erro ao atualizar:', err);
        }
      });
    } else {
      // Criar novo produto
      this.productService.createProduct(this.newProduct).subscribe({
        next: (product) => {
          this.showMessage(`Produto "${product.nome}" criado com sucesso! (ID: ${product.id})`, 'success');
          this.loadProducts();
          this.newProduct = { nome: '', preco: 0 };
          this.loading = false;
          console.log('Produto criado:', product);
        },
        error: (err) => {
          this.showMessage(`Erro ao criar: ${err.status} - ${err.statusText}`, 'error');
          this.loading = false;
          console.error('Erro ao criar:', err);
        }
      });
    }
  }

  viewProduct(id: number) {
    this.selectedProduct = null;
    this.showMessage('Buscando detalhes...', 'info');

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.selectedProduct = product;
        this.message = null;
        console.log('Produto visualizado:', product);
      },
      error: (err) => {
        this.showMessage(`Erro ao buscar produto: ${err.status}`, 'error');
        console.error('Erro ao buscar produto:', err);
      }
    });
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.editingId = product.id;
    this.newProduct = {
      nome: product.nome,
      preco: product.preco
    };
    this.selectedProduct = null;
    this.showMessage(`Editando: ${product.nome}`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;
    this.newProduct = { nome: '', preco: 0 };
    this.message = null;
  }

  deleteProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    const confirmDelete = confirm(`Tem certeza que deseja excluir "${product?.nome}"?`);

    if (!confirmDelete) return;

    this.showMessage('Excluindo produto...', 'info');

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showMessage(`Produto excluído com sucesso!`, 'success');
        this.loadProducts();
        if (this.selectedProduct?.id === id) {
          this.selectedProduct = null;
        }
        console.log('Produto excluído:', id);
      },
      error: (err) => {
        this.showMessage(`Erro ao excluir: ${err.status}`, 'error');
        console.error('Erro ao excluir:', err);
      }
    });
  }

  closeDetails() {
    this.selectedProduct = null;
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info') {
    this.message = message;
    this.messageClass = `message-${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        this.message = null;
      }, 5000);
    }
  }
}