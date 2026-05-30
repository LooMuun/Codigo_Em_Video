import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

export interface MaterialFile {
  nome: string;
  tipo: 'pdf' | 'notebook' | 'csv' | 'outro';
  tamanhoBytes: number;
  tamanho: string;
  modulo: string;
  categoria: 'slides' | 'exercicios';
}

@Injectable()
export class FilesService {
  private readonly filesDir = 'C:\\Users\\velton\\Codigo_Em_Video\\curso_cienciaDeDados';

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private getTipo(ext: string): MaterialFile['tipo'] {
    if (ext === '.pdf') return 'pdf';
    if (ext === '.ipynb') return 'notebook';
    if (ext === '.csv') return 'csv';
    return 'outro';
  }

  listFiles(moduloId?: string): MaterialFile[] {
    const categorias: Array<{ pasta: 'slides' | 'exercicios'; dir: string }> = [
      { pasta: 'slides', dir: path.join(this.filesDir, 'slides') },
      { pasta: 'exercicios', dir: path.join(this.filesDir, 'exercicios') },
    ];

    const resultado: MaterialFile[] = [];

    for (const { pasta, dir } of categorias) {
      if (!fs.existsSync(dir)) continue;

      const arquivos = fs.readdirSync(dir);

      for (const nome of arquivos) {
        const filePath = path.join(dir, nome);
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const ext = path.extname(nome).toLowerCase();

        // Extrai "Modulo X" do nome do arquivo (ex: "Modulo 1_Aula-1.pdf")
        const matchModulo = nome.match(/^Modulo\s*(\d+)/i);
        const modulo = matchModulo ? matchModulo[1] : '0';

        // Filtra por módulo se informado
        if (moduloId && modulo !== moduloId) continue;

        resultado.push({
          nome,
          tipo: this.getTipo(ext),
          tamanhoBytes: stat.size,
          tamanho: this.formatBytes(stat.size),
          modulo,
          categoria: pasta,
        });
      }
    }

    // Ordenar por categoria e nome
    resultado.sort((a, b) => {
      if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
      return a.nome.localeCompare(b.nome);
    });

    return resultado;
  }

  async getFilePath(fileName: string, categoria: string): Promise<string> {
    // Segurança: impede path traversal
    const safeName = path.basename(fileName);
    const safeCategoria = ['slides', 'exercicios'].includes(categoria) ? categoria : '';

    let filePath: string;

    if (safeCategoria) {
      filePath = path.join(this.filesDir, safeCategoria, safeName);
    } else {
      // Tenta encontrar em ambas as pastas
      const tentativas = [
        path.join(this.filesDir, 'slides', safeName),
        path.join(this.filesDir, 'exercicios', safeName),
      ];
      filePath = tentativas.find(p => fs.existsSync(p)) || '';
    }

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return filePath;
  }
}
