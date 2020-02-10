import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

const date = new Date();
const defaultInsert = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}:>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "varchar", length: 250 })
  description: string;

  @Column({ default: "Pendente", nullable: false, type: "varchar", length: 30 })
  status: string;

  @Column({ default: defaultInsert, nullable: false, type: "varchar" })
  insertedAt: string;
}
