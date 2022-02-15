class CreateBitacoraRevisiones < ActiveRecord::Migration[6.0]
  def change
    create_table :bitacora_revisiones do |t|
      t.string :revision
      t.references :motivo, null: false, foreign_key: true
      t.references :minuta, null: false, foreign_key: true
      t.boolean :emitida, default: false
      t.boolean :activa, default: true
      t.datetime :fecha_emision

      t.timestamps
    end
  end
end
