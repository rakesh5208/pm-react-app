import React, { useEffect, useMemo } from 'react'
import { useProjectStore } from '@/stores/projects';
import type { Form } from '@/types/form';
import Table from '@/components/common/table/Table';
import ProjectListColumnConfigs from '@/constants/table-columns-configs/projects-table';

interface ProjectListProps {
  form: Form | undefined
}

const List:React.FC<ProjectListProps> = ({ form }) => {
  const { fetchProjects, isLoading, projects, error } = useProjectStore();
  
  const allFormFields = useMemo(() => {
    return form?.fields || [];
  }, [form]);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  if(!form) {
    return <div>Form can't be null</div>
  }

  if (isLoading ) {
    return  <div> Loading...</div>
  }

  if(error) {
    return <div>Error occurred while loading project list</div>
  }


  return (
      <Table
        tableColumnConfigs = { ProjectListColumnConfigs }
        allFormFields = {allFormFields}
        data = { projects }
      />
  )
}

export default List