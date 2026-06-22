import Navbar from '@/components/navbar'

const Page = async ({ params }: {params: Promise<{ id: string}>}) => {
    const { id } = await params;
    
  return (
    // div containing main content
    <div>
      {/* gradient or picture */}
        <div>

        </div>

        {/* page with details */}
        <div>
            {/* name department and other stuff
            The initial part of the main area that
            shows your info */}
            <div>
            </div> 

            {/* The part with the cards of courses that are clickable */}
            <div>
            </div>
        </div>
    </div>
  );
};

export default Page;