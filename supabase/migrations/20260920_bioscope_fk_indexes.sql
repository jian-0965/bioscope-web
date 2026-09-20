create index if not exists learning_path_nodes_structure_id_idx
  on public.learning_path_nodes(structure_id);

create index if not exists user_progress_node_id_idx
  on public.user_progress(node_id);
