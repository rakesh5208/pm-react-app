import Header from '../header/Header'
import { useFormById } from '@/hooks/useFormById';
import List from '../list/List';
import { useEffect, useRef, useState } from 'react';

const ListContainer = () => {
  const { isFormLoading, form, error: formError} = useFormById('project_form');
  const isListView = true;
  const listBodyContainer = useRef<HTMLDivElement>(null);
  const [listContainerPositionFromTop, setListContainerPositionFromTop] = useState(0);
  useEffect(() => {
    if(listBodyContainer.current) {
      
      const rect = listBodyContainer.current.getBoundingClientRect();
      console.log("rect >> ", rect)
      setListContainerPositionFromTop(rect.top);
    }
  }, [listBodyContainer]);

  
  if( isFormLoading && !form) {
    return <div> Loading...</div>
  }

  if( formError ) {
    return <div> Error occurred while fetching </div>
  }

  

  return (
    <>
        <Header/>
        <div style={{height: `calc(100vh - ${listContainerPositionFromTop}px)`}} className='overflow-y-auto' ref={listBodyContainer}>
          {
            isListView ? <List form = { form }/> : <div> We have only List view </div>
          }
        </div>
        {/* {
            projects.map((project) => {
                return (
                    <div> 
                        <Link to={`/ws/${project.key}`}> {project.name}</Link>
                        <Link to={`/projects/${project.id}`}> Show Project Details</Link>
                    </div>
                )
            })
        } */}
    </>
  )
}

export default ListContainer