"use client";

import {
    useCallback,
    useState,
    useRef,
    type KeyboardEventHandler,
    type FormEventHandler,
} from "react";
import { useSession, signOut } from "next-auth/react";
import { api } from "@khenzii-dev/providers";
import {
    Paragraph,
    Button,
    Icon,
    Flex,
    Header,
    CodeBlock,
    Loading,
    Dialog,
    Input,
} from "@khenzii-dev/ui/atoms";
import style from "@khenzii-dev/styles/admin.module.scss";

const Admin = () => {
    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
    const projectNameInput = useRef<HTMLInputElement>(null);
    const projectDescriptionInput = useRef<HTMLInputElement>(null);
    const {
        data: currentProjectData,
        isLoading: currentProjectIsLoading,
        refetch: currentProjectRefetch,
    } = api.currentProject.getProject.useQuery();
    const {
        data: oldProjectsData,
        isLoading: oldProjectsAreLoading,
        refetch: oldProjectsRefetch,
    } = api.currentProject.getOldProjects.useQuery();
    const { mutateAsync: setCurrentProjectMutation } = api.currentProject.setCurrentProject.useMutation();
    const { mutateAsync: deleteProjectMutation } = api.currentProject.deleteProject.useMutation();
    const { mutateAsync: addProjectMutation } = api.currentProject.addProject.useMutation();

    const setCurrentProject = useCallback(async (projectId: string) => {
        await setCurrentProjectMutation({ projectId });

        await currentProjectRefetch();
        await oldProjectsRefetch();
    }, [setCurrentProjectMutation, currentProjectRefetch, oldProjectsRefetch]);

    const deleteProject = useCallback(async (projectId: string) => {
        await deleteProjectMutation({ projectId });

        await oldProjectsRefetch();
    }, [deleteProjectMutation, oldProjectsRefetch]);

    const addProject = useCallback(async (name: string, description: string) => {
        await addProjectMutation({ name, description });

        await oldProjectsRefetch();
    }, [addProjectMutation, oldProjectsRefetch]);

    const handleKeyDownProjectNameInput: KeyboardEventHandler = (event) => {
        if (!projectDescriptionInput.current) return;

        const keys: string[] = ["Enter", "ArrowDown"];
        if (keys.includes(event.key)) {
            // don't submit the form if clicked "Enter"
            event.preventDefault();

            projectDescriptionInput.current.focus();
        }
    };

    const handleKeyDownProjectDescriptionInput: KeyboardEventHandler = (event) => {
        if (!projectNameInput.current) return;

        if (event.key == "ArrowUp") projectNameInput.current.focus();
    };

    const onAddProjectDialogOpen = useCallback(() => {
        setIsAddProjectDialogOpen(true);

        if (!projectNameInput.current) return;
        projectNameInput.current.focus();
    }, []);

    const onAddProjectDialogClose = useCallback(async (confirmed: boolean) => {
        setIsAddProjectDialogOpen(false);
        if (!confirmed) return;

        if (!projectNameInput.current || !projectDescriptionInput.current) return;
        const name = projectNameInput.current.value;
        const description = projectDescriptionInput.current.value;
        await addProject(name, description);
    }, [addProject]);

    // eslint-disable-next-line
    const handleAddProjectFormSubmit: FormEventHandler = useCallback(async (event) => {
        // don't refresh the page
        event.preventDefault();

        await onAddProjectDialogClose(true);
    }, [onAddProjectDialogClose]);

    
    const { data: session } = useSession();
    if (!session) return;


    return (
        <Flex
            direction="column"
            gap={20}
            className={style.container}
        >
            <Flex
                direction="column"
                align="center"
            >
                <Header>Welcome, {session.user.name}!</Header>

                <Flex direction="column" align="center">
                    <Paragraph fontSize={1.75}>Session Details:</Paragraph>
                    <Paragraph fontSize={1.5}>
                        <CodeBlock>
                            Username: {session.user.name} <br />
                            Email: {session.user.email} <br />
                        </CodeBlock>
                    </Paragraph>
                </Flex>

                <Button
                    onClick={() => signOut({ redirect: false })}
                    className={style.logout_button}
                >
                    <Flex direction="row" align="center">
                        <Paragraph fontSize={1.5}>Logout</Paragraph>
                        <Icon iconName={"box-arrow-right"} size={1.5} />
                    </Flex>
                </Button>
            </Flex>

            <Flex
                direction="column"
                align="center"
            >
                <Header>Current Project</Header>

                {(currentProjectIsLoading || currentProjectData === undefined)
                    ? (
                        <Loading size={100} />
                    )
                    : (
                        <Paragraph fontSize={1.5}>
                            <CodeBlock>
                                Name: {currentProjectData.name} <br />
                                description: {currentProjectData.description} <br />
                            </CodeBlock>
                        </Paragraph>
                    )
                }

                <Paragraph fontSize={1.75}>Other Projects:</Paragraph>

                <Button onClick={onAddProjectDialogOpen}>
                    <Icon iconName={"plus-lg"} size={1.5} />
                </Button>

                <Dialog
                    title={"Add Project"}
                    open={isAddProjectDialogOpen}
                    onClose={() => onAddProjectDialogClose(false)}
                >
                    <form onSubmit={handleAddProjectFormSubmit} className={style.add_project_form}>
                        <Flex direction={"column"} gap={10}>
                            <Input
                                placeholder={"Project's Name.."}
                                onKeyDown={handleKeyDownProjectNameInput}
                                ref={projectNameInput}
                            />

                            <Input
                                placeholder={"Project's Description.."}
                                onKeyDown={handleKeyDownProjectDescriptionInput}
                                ref={projectDescriptionInput}
                            />
                        </Flex>
                        
                        <Button onClick={handleAddProjectFormSubmit}>
                            <Icon iconName={"check"} size={1.5} />
                        </Button>
                    </form>
                </Dialog>

                {(oldProjectsAreLoading || oldProjectsData === undefined)
                    ? (
                        <Loading size={100} />
                    )
                    : oldProjectsData.map((project, index) => (
                        <Flex key={`project-${index}`}>
                            <Paragraph fontSize={1.5}>
                                <CodeBlock>
                                    Name: {project.name} <br />
                                    description: {project.description} <br />
                                </CodeBlock>
                            </Paragraph>

                            <Button onClick={() => setCurrentProject(project.id)}>
                                <Icon iconName={"check"} size={1.5} />
                            </Button>

                             <Button
                                onClick={() => deleteProject(project.id)}
                                color={"destructive"}
                             >
                                <Icon iconName={"trash"} size={1.5} />
                             </Button>
                        </Flex>
                    ))
                }
            </Flex>

            <Flex
                direction="column"
                align="center"
            >
                <Header>Blog</Header>

                <Paragraph fontSize={1.75}>This section is still being built..</Paragraph>
            </Flex>

            <Flex
                direction="column"
                align="center"
            >
                <Header>Event Log</Header>

                <Paragraph fontSize={1.75}>This section is still being built..</Paragraph>
            </Flex>
        </Flex>
    );
};

export default Admin;
